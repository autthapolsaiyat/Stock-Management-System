-- Migration: Create Checkin Tables
-- Date: 2024-12-29

-- Add nickname to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(50);

-- Create checkin_records table
CREATE TABLE IF NOT EXISTS checkin_records (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    checkin_date DATE NOT NULL,
    
    -- Clock In
    clock_in_time TIMESTAMP,
    clock_in_status VARCHAR(20),
    clock_in_late_minutes INT DEFAULT 0,
    clock_in_latitude DECIMAL(10, 8),
    clock_in_longitude DECIMAL(11, 8),
    clock_in_note TEXT,
    
    -- Clock Out
    clock_out_time TIMESTAMP,
    clock_out_status VARCHAR(20),
    clock_out_early_minutes INT DEFAULT 0,
    clock_out_latitude DECIMAL(10, 8),
    clock_out_longitude DECIMAL(11, 8),
    clock_out_note TEXT,
    
    -- OT
    ot_hours DECIMAL(4, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, checkin_date)
);

-- Create leave_records table
CREATE TABLE IF NOT EXISTS leave_records (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    leave_date DATE NOT NULL,
    leave_type VARCHAR(30) NOT NULL,
    leave_duration VARCHAR(10) DEFAULT 'FULL',
    leave_days DECIMAL(3, 1) DEFAULT 1,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'APPROVED',
    approved_by INT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, leave_date, leave_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_checkin_records_user_date ON checkin_records(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_checkin_records_date ON checkin_records(checkin_date);
CREATE INDEX IF NOT EXISTS idx_leave_records_user_date ON leave_records(user_id, leave_date);
CREATE INDEX IF NOT EXISTS idx_leave_records_date ON leave_records(leave_date);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description)
VALUES 
    ('CHECKIN_CLOCK_IN_TIME', '09:00', 'STRING', 'CHECKIN', 'เวลาเข้างาน'),
    ('CHECKIN_CLOCK_OUT_TIME', '18:00', 'STRING', 'CHECKIN', 'เวลาออกงาน'),
    ('CHECKIN_GRACE_PERIOD', '15', 'NUMBER', 'CHECKIN', 'ระยะเวลายืดหยุ่น (นาที)'),
    ('CHECKIN_LINE_TOKEN', '', 'STRING', 'CHECKIN', 'LINE Notify Token'),
    ('CHECKIN_NOTIFY_ON_CHECKIN', 'true', 'BOOLEAN', 'CHECKIN', 'แจ้งเตือนเมื่อเช็คอิน'),
    ('CHECKIN_NOTIFY_ON_CHECKOUT', 'true', 'BOOLEAN', 'CHECKIN', 'แจ้งเตือนเมื่อเช็คออก'),
    ('CHECKIN_NOTIFY_ON_LATE', 'true', 'BOOLEAN', 'CHECKIN', 'แจ้งเตือนเมื่อมาสาย'),
    ('CHECKIN_NOTIFY_DAILY_SUMMARY', 'true', 'BOOLEAN', 'CHECKIN', 'ส่งสรุปประจำวัน'),
    ('CHECKIN_DAILY_SUMMARY_TIME', '18:30', 'STRING', 'CHECKIN', 'เวลาส่งสรุปประจำวัน')
ON CONFLICT (setting_key) DO NOTHING;
