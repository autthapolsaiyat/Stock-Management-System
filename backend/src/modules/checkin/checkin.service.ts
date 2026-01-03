import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CheckinRecordEntity, CheckinStatus } from './entities/checkin-record.entity';
import { LeaveRecordEntity, LeaveType, LeaveDuration, LeaveStatus } from './entities/leave-record.entity';
import { ClockInDto, ClockOutDto, CreateLeaveDto, UpdateLeaveDto, CheckinSettingsDto } from './dto';
import { SystemSettingsService } from '../system-settings/system-settings.service';
import axios from 'axios';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(CheckinRecordEntity)
    private readonly checkinRepo: Repository<CheckinRecordEntity>,
    @InjectRepository(LeaveRecordEntity)
    private readonly leaveRepo: Repository<LeaveRecordEntity>,
    private readonly settingsService: SystemSettingsService,
  ) {}

  // ==================== CLOCK IN/OUT ====================

  async clockIn(userId: number, dto: ClockInDto) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Check if already clocked in today
    let record = await this.checkinRepo.findOne({
      where: { userId, checkinDate: dateStr as any },
    });

    if (record?.clockInTime) {
      throw new BadRequestException('คุณได้เช็คอินเข้างานวันนี้แล้ว');
    }

    // Get settings
    const clockInTime = await this.getSetting('CHECKIN_CLOCK_IN_TIME', '09:00');
    const gracePeriod = parseInt(await this.getSetting('CHECKIN_GRACE_PERIOD', '15'));

    // Calculate if late
    const [hours, minutes] = clockInTime.split(':').map(Number);
    const expectedTime = new Date(today);
    expectedTime.setHours(hours, minutes + gracePeriod, 0, 0);

    const isLate = today > expectedTime;
    let lateMinutes = 0;
    if (isLate) {
      lateMinutes = Math.floor((today.getTime() - expectedTime.getTime()) / 60000) + gracePeriod;
    }

    if (!record) {
      record = this.checkinRepo.create({
        userId,
        checkinDate: dateStr as any,
      });
    }

    record.clockInTime = today;
    record.clockInStatus = isLate ? CheckinStatus.LATE : CheckinStatus.NORMAL;
    record.clockInLateMinutes = lateMinutes;
    record.clockInLatitude = dto.latitude;
    record.clockInLongitude = dto.longitude;
    record.clockInNote = dto.note;

    await this.checkinRepo.save(record);

    // Send LINE notification
    await this.sendCheckinNotification(userId, record, 'IN');

    return record;
  }

  async clockOut(userId: number, dto: ClockOutDto) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Check if clocked in today
    const record = await this.checkinRepo.findOne({
      where: { userId, checkinDate: dateStr as any },
    });

    if (!record?.clockInTime) {
      throw new BadRequestException('คุณยังไม่ได้เช็คอินเข้างานวันนี้');
    }

    if (record.clockOutTime) {
      throw new BadRequestException('คุณได้เช็คออกวันนี้แล้ว');
    }

    // Get settings
    const clockOutTime = await this.getSetting('CHECKIN_CLOCK_OUT_TIME', '18:00');

    // Calculate if early or OT
    const [hours, minutes] = clockOutTime.split(':').map(Number);
    const expectedTime = new Date(today);
    expectedTime.setHours(hours, minutes, 0, 0);

    const isEarly = today < expectedTime;
    let earlyMinutes = 0;
    let otHours = 0;

    if (isEarly) {
      earlyMinutes = Math.floor((expectedTime.getTime() - today.getTime()) / 60000);
    } else {
      otHours = Math.round((today.getTime() - expectedTime.getTime()) / 3600000 * 100) / 100;
    }

    record.clockOutTime = today;
    record.clockOutStatus = isEarly ? CheckinStatus.EARLY : CheckinStatus.NORMAL;
    record.clockOutEarlyMinutes = earlyMinutes;
    record.clockOutLatitude = dto.latitude;
    record.clockOutLongitude = dto.longitude;
    record.clockOutNote = dto.note;
    record.otHours = otHours;

    await this.checkinRepo.save(record);

    // Send LINE notification
    await this.sendCheckinNotification(userId, record, 'OUT');

    return record;
  }

  async getTodayStatus(userId: number) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const record = await this.checkinRepo.findOne({
      where: { userId, checkinDate: dateStr as any },
    });

    const clockInTime = await this.getSetting('CHECKIN_CLOCK_IN_TIME', '09:00');
    const clockOutTime = await this.getSetting('CHECKIN_CLOCK_OUT_TIME', '18:00');
    const gracePeriod = parseInt(await this.getSetting('CHECKIN_GRACE_PERIOD', '15'));

    return {
      date: dateStr,
      clockInTime,
      clockOutTime,
      gracePeriod,
      record,
    };
  }

  async getHistory(userId: number, limit = 10) {
    return this.checkinRepo.find({
      where: { userId },
      order: { checkinDate: 'DESC' },
      take: limit,
    });
  }

  // ==================== LEAVE MANAGEMENT ====================

  async createLeave(userId: number, dto: CreateLeaveDto) {
    const leaveDays = dto.leaveDuration === LeaveDuration.FULL ? 1 : 0.5;

    const leave = this.leaveRepo.create({
      userId,
      leaveDate: dto.leaveDate as any,
      leaveType: dto.leaveType,
      leaveDuration: dto.leaveDuration || LeaveDuration.FULL,
      leaveDays,
      reason: dto.reason,
      status: LeaveStatus.APPROVED, // Auto-approve for now
    });

    const savedLeave = await this.leaveRepo.save(leave);
    
    // Send LINE notification
    await this.sendLeaveNotification(userId, savedLeave);
    
    return savedLeave;
  }

  async updateLeave(id: number, dto: UpdateLeaveDto) {
    const leave = await this.leaveRepo.findOneBy({ id });
    if (!leave) {
      throw new BadRequestException('ไม่พบข้อมูลการลา');
    }

    if (dto.leaveDuration) {
      leave.leaveDays = dto.leaveDuration === LeaveDuration.FULL ? 1 : 0.5;
    }

    Object.assign(leave, dto);
    return this.leaveRepo.save(leave);
  }

  async deleteLeave(id: number) {
    const leave = await this.leaveRepo.findOneBy({ id });
    if (!leave) {
      throw new BadRequestException('ไม่พบข้อมูลการลา');
    }
    return this.leaveRepo.remove(leave);
  }

  async createBulkLeave(userId: number, dto: { startDate: string; endDate: string; leaveType: LeaveType; reason?: string }) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    
    // Validate date range
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays <= 0) {
      throw new BadRequestException('วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น');
    }
    
    // Limit for maternity/ordination: 120 days
    if ((dto.leaveType === LeaveType.MATERNITY || dto.leaveType === LeaveType.ORDINATION) && diffDays > 120) {
      throw new BadRequestException('ลาคลอด/อุปสมบท ไม่เกิน 120 วัน');
    }
    
    // Create leave records for each day
    const leaves: LeaveRecordEntity[] = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check if already has leave on this date
      const existing = await this.leaveRepo.findOne({
        where: { userId, leaveDate: dateStr as any },
      });
      
      if (!existing) {
        const leave = this.leaveRepo.create({
          userId,
          leaveDate: dateStr as any,
          leaveType: dto.leaveType,
          leaveDuration: LeaveDuration.FULL,
          leaveDays: 1,
          reason: dto.reason,
          status: LeaveStatus.APPROVED,
        });
        leaves.push(leave);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (leaves.length === 0) {
      throw new BadRequestException('ไม่สามารถสร้างรายการลาได้ (อาจมีการลาในวันเหล่านี้แล้ว)');
    }
    
    await this.leaveRepo.save(leaves);
    
    // Send LINE notification
    await this.sendBulkNotification(userId, 'LEAVE', dto.startDate, dto.endDate, leaves.length, dto.leaveType, dto.reason);
    
    return {
      message: `สร้างรายการลาสำเร็จ ${leaves.length} วัน`,
      totalDays: leaves.length,
      leaves,
    };
  }

  async createBulkCheckin(userId: number, dto: { startDate: string; endDate: string; note?: string }) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    
    // Validate date range
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays <= 0) {
      throw new BadRequestException('วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น');
    }
    
    if (diffDays > 120) {
      throw new BadRequestException('ไม่สามารถบันทึกได้เกิน 120 วัน');
    }
    
    // Get settings for work hours
    const clockInTime = await this.getSetting('CHECKIN_CLOCK_IN_TIME', '09:00');
    const clockOutTime = await this.getSetting('CHECKIN_CLOCK_OUT_TIME', '18:00');
    
    const [inHours, inMinutes] = clockInTime.split(':').map(Number);
    const [outHours, outMinutes] = clockOutTime.split(':').map(Number);
    
    // Create checkin records for each day
    const records: CheckinRecordEntity[] = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check if already has checkin on this date
      const existing = await this.checkinRepo.findOne({
        where: { userId, checkinDate: dateStr as any },
      });
      
      if (!existing) {
        // Create clock in time
        const clockIn = new Date(currentDate);
        clockIn.setHours(inHours, inMinutes, 0, 0);
        
        // Create clock out time
        const clockOut = new Date(currentDate);
        clockOut.setHours(outHours, outMinutes, 0, 0);
        
        const record = this.checkinRepo.create({
          userId,
          checkinDate: dateStr as any,
          clockInTime: clockIn,
          clockInStatus: CheckinStatus.NORMAL,
          clockInLateMinutes: 0,
          clockInNote: dto.note || 'ไปทำงานนอกสถานที่',
          clockOutTime: clockOut,
          clockOutStatus: CheckinStatus.NORMAL,
          clockOutEarlyMinutes: 0,
          otHours: 0,
        });
        records.push(record);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (records.length === 0) {
      throw new BadRequestException('ไม่สามารถสร้างรายการได้ (อาจมีการเช็คอินในวันเหล่านี้แล้ว)');
    }
    
    await this.checkinRepo.save(records);
    
    // Send LINE notification
    await this.sendBulkNotification(userId, 'WORK', dto.startDate, dto.endDate, records.length, undefined, dto.note);
    
    return {
      message: `บันทึกการทำงานนอกสถานที่สำเร็จ ${records.length} วัน`,
      totalDays: records.length,
    };
  }

  async getLeavesByUser(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.leaveRepo.find({
      where: {
        userId,
        leaveDate: Between(startDate, endDate),
      },
      order: { leaveDate: 'ASC' },
    });
  }

  // ==================== MONTHLY REPORT ====================

  async getMonthlyReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all checkin records for the month
    const checkinRecords = await this.checkinRepo.find({
      where: {
        checkinDate: Between(startDate, endDate),
      },
      relations: ['user'],
    });

    // Get all leave records for the month
    const leaveRecords = await this.leaveRepo.find({
      where: {
        leaveDate: Between(startDate, endDate),
      },
      relations: ['user'],
    });

    // Group by user
    const userStats = new Map<number, any>();

    // Process checkin records
    for (const record of checkinRecords) {
      if (!userStats.has(record.userId)) {
        userStats.set(record.userId, {
          userId: record.userId,
          fullName: record.user?.fullName || '',
          nickname: (record.user as any)?.nickname || '',
          lateHours: 0,
          earlyLeaveCount: 0,
          earlyLeaveHours: 0,
          workDays: 0,
          otHours: 0,
          vacation: 0,
          personal: 0,
          sick: 0,
          maternity: 0,
          ordination: 0,
          sickHalf: 0,
          personalHalf: 0,
          totalLeaveDays: 0,
        });
      }

      const stat = userStats.get(record.userId);

      if (record.clockInTime) {
        stat.workDays++;
        if (record.clockInStatus === CheckinStatus.LATE) {
          stat.lateHours += record.clockInLateMinutes / 60;
        }
      }

      if (record.clockOutTime && record.clockOutStatus === CheckinStatus.EARLY) {
        stat.earlyLeaveCount++;
        stat.earlyLeaveHours += record.clockOutEarlyMinutes / 60;
      }

      stat.otHours += record.otHours || 0;
    }

    // Process leave records
    for (const leave of leaveRecords) {
      if (!userStats.has(leave.userId)) {
        userStats.set(leave.userId, {
          userId: leave.userId,
          fullName: leave.user?.fullName || '',
          nickname: (leave.user as any)?.nickname || '',
          lateHours: 0,
          earlyLeaveCount: 0,
          earlyLeaveHours: 0,
          workDays: 0,
          otHours: 0,
          vacation: 0,
          personal: 0,
          sick: 0,
          maternity: 0,
          ordination: 0,
          sickHalf: 0,
          personalHalf: 0,
          totalLeaveDays: 0,
        });
      }

      const stat = userStats.get(leave.userId);

      const isHalf = leave.leaveDuration !== LeaveDuration.FULL;

      switch (leave.leaveType) {
        case LeaveType.VACATION:
          stat.vacation += leave.leaveDays;
          break;
        case LeaveType.PERSONAL:
          if (isHalf) {
            stat.personalHalf += 1;
          } else {
            stat.personal += leave.leaveDays;
          }
          break;
        case LeaveType.SICK:
          if (isHalf) {
            stat.sickHalf += 1;
          } else {
            stat.sick += leave.leaveDays;
          }
          break;
        case LeaveType.MATERNITY:
          stat.maternity += leave.leaveDays;
          break;
        case LeaveType.ORDINATION:
          stat.ordination += leave.leaveDays;
          break;
      }

      stat.totalLeaveDays += leave.leaveDays;
    }

    // Convert to array and calculate totals
    const report = Array.from(userStats.values()).map((stat, index) => ({
      ...stat,
      index: index + 1,
      lateHours: Math.round(stat.lateHours * 10) / 10,
      otHours: Math.round(stat.otHours * 10) / 10,
    }));

    // Calculate totals
    const totals = {
      totalEmployees: report.length,
      totalLateHours: report.reduce((sum, r) => sum + r.lateHours, 0),
      totalEarlyLeave: report.reduce((sum, r) => sum + r.earlyLeaveCount, 0),
      totalVacation: report.reduce((sum, r) => sum + r.vacation, 0),
      totalPersonal: report.reduce((sum, r) => sum + r.personal, 0),
      totalSick: report.reduce((sum, r) => sum + r.sick, 0),
      totalMaternity: report.reduce((sum, r) => sum + r.maternity, 0),
      totalOrdination: report.reduce((sum, r) => sum + r.ordination, 0),
      totalSickHalf: report.reduce((sum, r) => sum + r.sickHalf, 0),
      totalPersonalHalf: report.reduce((sum, r) => sum + r.personalHalf, 0),
      totalLeaveDays: report.reduce((sum, r) => sum + r.totalLeaveDays, 0),
      totalWorkDays: report.reduce((sum, r) => sum + r.workDays, 0),
      totalOtHours: report.reduce((sum, r) => sum + r.otHours, 0),
    };

    return { report, totals };
  }

  async getMonthlySummary(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const checkinRecords = await this.checkinRepo.find({
      where: {
        userId,
        checkinDate: Between(startDate, endDate),
      },
    });

    const leaveRecords = await this.leaveRepo.find({
      where: {
        userId,
        leaveDate: Between(startDate, endDate),
      },
    });

    const workDays = checkinRecords.filter(r => r.clockInTime).length;
    const lateDays = checkinRecords.filter(r => r.clockInStatus === CheckinStatus.LATE).length;
    const earlyLeaveDays = checkinRecords.filter(r => r.clockOutStatus === CheckinStatus.EARLY).length;
    const leaveDays = leaveRecords.reduce((sum, r) => sum + Number(r.leaveDays), 0);

    return {
      workDays,
      lateDays,
      earlyLeaveDays,
      leaveDays,
    };
  }

  // ==================== SETTINGS ====================

  async getSettings() {
    const keys = [
      'CHECKIN_CLOCK_IN_TIME',
      'CHECKIN_CLOCK_OUT_TIME',
      'CHECKIN_GRACE_PERIOD',
      'CHECKIN_LINE_TOKEN',
      'CHECKIN_LINE_CHANNEL_ACCESS_TOKEN',
      'CHECKIN_LINE_GROUP_ID',
      'CHECKIN_NOTIFY_ON_CHECKIN',
      'CHECKIN_NOTIFY_ON_CHECKOUT',
      'CHECKIN_NOTIFY_ON_LATE',
      'CHECKIN_NOTIFY_DAILY_SUMMARY',
      'CHECKIN_DAILY_SUMMARY_TIME',
    ];

    const settings: Record<string, string> = {};
    for (const key of keys) {
      settings[key] = await this.getSetting(key, '');
    }

    return {
      clockInTime: settings.CHECKIN_CLOCK_IN_TIME || '09:00',
      clockOutTime: settings.CHECKIN_CLOCK_OUT_TIME || '18:00',
      gracePeriodMinutes: parseInt(settings.CHECKIN_GRACE_PERIOD) || 15,
      lineNotifyToken: settings.CHECKIN_LINE_TOKEN || '',
      lineChannelAccessToken: settings.CHECKIN_LINE_CHANNEL_ACCESS_TOKEN || '',
      lineGroupId: settings.CHECKIN_LINE_GROUP_ID || '',
      notifyOnCheckin: settings.CHECKIN_NOTIFY_ON_CHECKIN !== 'false',
      notifyOnCheckout: settings.CHECKIN_NOTIFY_ON_CHECKOUT !== 'false',
      notifyOnLate: settings.CHECKIN_NOTIFY_ON_LATE !== 'false',
      notifyDailySummary: settings.CHECKIN_NOTIFY_DAILY_SUMMARY !== 'false',
      dailySummaryTime: settings.CHECKIN_DAILY_SUMMARY_TIME || '18:30',
    };
  }

  async updateSettings(dto: CheckinSettingsDto) {
    const settings = [
      { key: 'CHECKIN_CLOCK_IN_TIME', value: dto.clockInTime },
      { key: 'CHECKIN_CLOCK_OUT_TIME', value: dto.clockOutTime },
      { key: 'CHECKIN_GRACE_PERIOD', value: dto.gracePeriodMinutes?.toString() },
      { key: 'CHECKIN_LINE_TOKEN', value: dto.lineNotifyToken },
      { key: 'CHECKIN_LINE_CHANNEL_ACCESS_TOKEN', value: dto.lineChannelAccessToken },
      { key: 'CHECKIN_LINE_GROUP_ID', value: dto.lineGroupId },
      { key: 'CHECKIN_NOTIFY_ON_CHECKIN', value: dto.notifyOnCheckin?.toString() },
      { key: 'CHECKIN_NOTIFY_ON_CHECKOUT', value: dto.notifyOnCheckout?.toString() },
      { key: 'CHECKIN_NOTIFY_ON_LATE', value: dto.notifyOnLate?.toString() },
      { key: 'CHECKIN_NOTIFY_DAILY_SUMMARY', value: dto.notifyDailySummary?.toString() },
      { key: 'CHECKIN_DAILY_SUMMARY_TIME', value: dto.dailySummaryTime },
    ].filter(s => s.value !== undefined);

    for (const setting of settings) {
      await this.settingsService.upsert(setting.key, setting.value, 0, 'CHECKIN');
    }

    return this.getSettings();
  }

  // ==================== LINE NOTIFY ====================

  async sendLineNotify(message: string) {
    // Try LINE Messaging API first
    const channelAccessToken = await this.getSetting('CHECKIN_LINE_CHANNEL_ACCESS_TOKEN', '');
    const groupId = await this.getSetting('CHECKIN_LINE_GROUP_ID', '');
    
    if (channelAccessToken && groupId) {
      try {
        await axios.post(
          'https://api.line.me/v2/bot/message/push',
          {
            to: groupId,
            messages: [{ type: 'text', text: message }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${channelAccessToken}`,
            },
          },
        );
        return;
      } catch (error) {
        console.error('LINE Messaging API error:', error.response?.data || error.message);
      }
    }

    // Fallback to LINE Notify (legacy)
    const token = await this.getSetting('CHECKIN_LINE_TOKEN', '');
    if (!token) return;

    try {
      await axios.post(
        'https://notify-api.line.me/api/notify',
        `message=${encodeURIComponent(message)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error('LINE Notify error:', error.message);
    }
  }

  async testLineNotify() {
    const message = `
🔔 ทดสอบการแจ้งเตือน
📅 ${new Date().toLocaleDateString('th-TH')}
⏰ ${new Date().toLocaleTimeString('th-TH')}
✅ ระบบ Check-in พร้อมใช้งาน`;

    await this.sendLineNotify(message);
    return { success: true, message: 'ส่งข้อความทดสอบสำเร็จ' };
  }

  private async sendCheckinNotification(userId: number, record: CheckinRecordEntity, type: 'IN' | 'OUT') {
    const settings = await this.getSettings();

    if (type === 'IN' && !settings.notifyOnCheckin) return;
    if (type === 'OUT' && !settings.notifyOnCheckout) return;

    // Get user info
    const user = await this.checkinRepo.manager.findOne('UserEntity', {
      where: { id: userId },
    }) as any;

    const nickname = user?.nickname || user?.fullName || 'Unknown';
    const username = user?.username || '';
    const dateStr = new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');

    let message = '';

    if (type === 'IN') {
      const isLate = record.clockInStatus === CheckinStatus.LATE;
      const time = record.clockInTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      message = `😊 ${nickname}
👤 ${username}
📅 ${dateStr}
⏰ ${time}
🏢 Check IN${isLate ? `
⚠️ สาย ${record.clockInLateMinutes} นาที` : ''}
📍 ${record.clockInNote || 'ทำงานที่บริษัท'}`;

    } else {
      const time = record.clockOutTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const otText = record.otHours > 0 ? `\n⏱️ OT ${record.otHours} ชม.` : '';

      message = `😊 ${nickname}
👤 ${username}
📅 ${dateStr}
⏰ ${time}
🏢 Check Out${otText}
📍 ${record.clockOutNote || record.clockInNote || 'ทำงานที่บริษัท'}`;
    }

    await this.sendLineNotify(message);
  }

  private async sendLeaveNotification(userId: number, leave: LeaveRecordEntity) {
    // Get user info
    const user = await this.checkinRepo.manager.findOne('UserEntity', {
      where: { id: userId },
    }) as any;

    const nickname = user?.nickname || user?.fullName || 'Unknown';
    const username = user?.username || '';
    const leaveDate = new Date(leave.leaveDate);
    const dateStr = leaveDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const leaveTypeEmoji: Record<string, string> = {
      VACATION: '🏖️ ลาพักร้อน',
      PERSONAL: '👤 ลากิจส่วนตัว',
      SICK: '🏥 ลาป่วย',
      MATERNITY: '👶 ลาคลอด',
      ORDINATION: '🙏 ลาอุปสมบท',
    };

    let durationText = '';
    if (leave.leaveDuration === LeaveDuration.HALF_AM) {
      durationText = ' (ครึ่งวันเช้า)';
    } else if (leave.leaveDuration === LeaveDuration.HALF_PM) {
      durationText = ' (ครึ่งวันบ่าย)';
    }

    const message = `😊 ${nickname}
👤 ${username}
📅 ${dateStr}
${leaveTypeEmoji[leave.leaveType] || leave.leaveType}${durationText}${leave.reason ? `
📝 ${leave.reason}` : ''}`;

    await this.sendLineNotify(message);
  }

  private async sendBulkNotification(userId: number, type: 'LEAVE' | 'WORK', startDate: string, endDate: string, totalDays: number, leaveType?: string, reason?: string) {
    // Get user info
    const user = await this.checkinRepo.manager.findOne('UserEntity', {
      where: { id: userId },
    }) as any;

    const nickname = user?.nickname || user?.fullName || 'Unknown';
    const username = user?.username || '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startStr = start.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = end.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let message = '';

    if (type === 'WORK') {
      message = `😊 ${nickname}
👤 ${username}
📅 ${startStr} - ${endStr}
🚗 ทำงานนอกสถานที่${reason ? `
📝 ${reason}` : ''}
📊 รวม ${totalDays} วัน`;
    } else {
      const leaveTypeEmoji: Record<string, string> = {
        VACATION: '🏖️ ลาพักร้อน',
        PERSONAL: '👤 ลากิจส่วนตัว',
        SICK: '🏥 ลาป่วย',
        MATERNITY: '👶 ลาคลอด',
        ORDINATION: '🙏 ลาอุปสมบท',
      };

      message = `😊 ${nickname}
👤 ${username}
📅 ${startStr} - ${endStr}
${leaveTypeEmoji[leaveType || ''] || leaveType}${reason ? `
📝 ${reason}` : ''}
📊 รวม ${totalDays} วัน`;
    }

    await this.sendLineNotify(message);
  }

  async sendDailySummary() {
    // Disabled - ไม่ส่งสรุปประจำวัน
    return { success: true };
  }

  // ==================== ADMIN: MANAGE RECORDS ====================

  async getRecordsByDate(date: string) {
    const records = await this.checkinRepo.find({
      where: { checkinDate: date as any },
      relations: ['user'],
      order: { clockInTime: 'ASC' },
    });

    const leaves = await this.leaveRepo.find({
      where: { leaveDate: date as any },
      relations: ['user'],
    });

    return {
      date,
      checkinRecords: records.map(r => ({
        id: r.id,
        userId: r.userId,
        userName: r.user?.fullName || 'Unknown',
        nickname: r.user?.nickname || '',
        clockInTime: r.clockInTime,
        clockOutTime: r.clockOutTime,
        clockInStatus: r.clockInStatus,
        clockInLateMinutes: r.clockInLateMinutes,
        clockOutStatus: r.clockOutStatus,
        clockOutEarlyMinutes: r.clockOutEarlyMinutes,
        otHours: r.otHours,
      })),
      leaveRecords: leaves.map(l => ({
        id: l.id,
        userId: l.userId,
        userName: l.user?.fullName || 'Unknown',
        nickname: l.user?.nickname || '',
        leaveType: l.leaveType,
        leaveDuration: l.leaveDuration,
        leaveDays: l.leaveDays,
        reason: l.reason,
      })),
    };
  }

  async deleteCheckinRecord(id: number) {
    const record = await this.checkinRepo.findOneBy({ id });
    if (!record) {
      throw new BadRequestException('ไม่พบรายการเช็คอิน');
    }
    await this.checkinRepo.remove(record);
    return { success: true, message: 'ลบรายการเช็คอินสำเร็จ' };
  }

  // ==================== HELPERS ====================

  private async getSetting(key: string, defaultValue: string): Promise<string> {
    try {
      const setting = await this.settingsService.findByKey(key);
      return setting?.settingValue || defaultValue;
    } catch {
      return defaultValue;
    }
  }
}
