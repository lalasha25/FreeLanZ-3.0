import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { RegisterFreelancerDto } from './dto/register-freelancer.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private get db() {
    return this.prisma as any;
  }

  private excludePassword(user: any) {
    const { password: _pw, ...rest } = user;
    return rest;
  }

  async registerClient(dto: RegisterClientDto) {
    const existing = await this.db.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.db.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        role: 'CLIENT',
        phone: dto.phone ?? null,
      },
    });

    return { message: 'Client registered successfully', user: this.excludePassword(user) };
  }

  async registerFreelancer(dto: RegisterFreelancerDto) {
    const existing = await this.db.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.db.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        role: 'FREELANCER',
        phone: dto.phone ?? null,
        bio: dto.bio ?? null,
        skills: dto.skills ?? null,
        idPhotoUrl: dto.idPhotoUrl ?? null,
        cvUrl: dto.proposalUrl ?? null,
      },
    });

    if (dto.proposalUrl) {
      await this.db.portfolio.create({
        data: {
          title: 'Project Proposal',
          description: 'Project Proposal uploaded during registration',
          projectUrl: dto.proposalUrl,
          freelancerId: user.id,
        },
      });
    }

    return { message: 'Freelancer registered successfully', user: this.excludePassword(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.db.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: this.excludePassword(user),
    };
  }

  async getProfile(userId: number) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.excludePassword(user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.bio !== undefined) data.bio = dto.bio;
    if (dto.skills !== undefined) data.skills = dto.skills;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;

    const user = await this.db.user.update({ where: { id: userId }, data });
    return { message: 'Profile updated successfully', user: this.excludePassword(user) };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.db.user.update({ where: { id: userId }, data: { password: hashed } });

    return { message: 'Password changed successfully' };
  }
}