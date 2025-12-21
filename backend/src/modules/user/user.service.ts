import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity) private userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      where: { isActive: true },
      relations: ['userRoles', 'userRoles.role'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithInactive() {
    const users = await this.userRepository.find({
      relations: ['userRoles', 'userRoles.role'],
      order: { id: 'ASC' },
    });
    
    return users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive,
      roles: user.userRoles?.map(ur => ur.role?.code).filter(Boolean) || [],
      createdAt: user.createdAt,
    }));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username already exists');

    const passwordHash = await bcrypt.hash(dto.password || '123456', 10);
    const user = this.userRepository.create({
      username: dto.username,
      passwordHash,
      fullName: dto.fullName,
      email: dto.email,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    if (dto.roleIds?.length) {
      await this.assignRoles(savedUser.id, dto.roleIds);
    }

    return this.findOne(savedUser.id);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    if (dto.fullName) user.fullName = dto.fullName;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);

    await this.userRepository.save(user);

    if (dto.roleIds) {
      await this.assignRoles(id, dto.roleIds);
    }

    return this.findOne(id);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  private async assignRoles(userId: number, roleIds: number[]) {
    await this.userRoleRepository.delete({ userId });
    const userRoles = roleIds.map(roleId => this.userRoleRepository.create({ userId, roleId }));
    await this.userRoleRepository.save(userRoles);
  }

  async findAllRoles() {
    return this.roleRepository.find({ 
      where: { isActive: true },
      order: { id: 'ASC' },
    });
  }

  async updateRolesByCodes(userId: number, roleCodes: string[]) {
    await this.findOne(userId);
    
    const roles = await this.roleRepository.find({
      where: { code: In(roleCodes) }
    });
    
    await this.userRoleRepository.delete({ userId });
    
    const userRoles = roles.map(role => 
      this.userRoleRepository.create({ userId, roleId: role.id })
    );
    await this.userRoleRepository.save(userRoles);
    
    return { message: 'Roles updated successfully' };
  }

  async resetPassword(userId: number, newPassword: string) {
    const user = await this.findOne(userId);
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }

  async toggleActive(userId: number) {
    const user = await this.findOne(userId);
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` };
  }
}
