import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async create(freelancerId: number, dto: CreatePortfolioDto) {
    const portfolio = await this.db.portfolio.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl ?? null,
        projectUrl: dto.projectUrl ?? null,
        freelancerId,
      },
      include: {
        freelancer: { select: { id: true, name: true, email: true } },
      },
    });
    return { message: 'Portfolio created', portfolio };
  }

  async findAll() {
    return this.db.portfolio.findMany({
      include: {
        freelancer: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMine(freelancerId: number) {
    return this.db.portfolio.findMany({
      where: { freelancerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const portfolio = await this.db.portfolio.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }

  async findByFreelancer(freelancerId: number) {
    return this.db.portfolio.findMany({
      where: { freelancerId },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, userId: number, dto: UpdatePortfolioDto) {
    const portfolio = await this.db.portfolio.findUnique({ where: { id } });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    if (portfolio.freelancerId !== userId)
      throw new ForbiddenException('Access denied');

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.projectUrl !== undefined) data.projectUrl = dto.projectUrl;

    const updated = await this.db.portfolio.update({ where: { id }, data });
    return { message: 'Portfolio updated', portfolio: updated };
  }

  async remove(id: number, userId: number) {
    const portfolio = await this.db.portfolio.findUnique({ where: { id } });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    if (portfolio.freelancerId !== userId)
      throw new ForbiddenException('Access denied');

    await this.db.portfolio.delete({ where: { id } });
    return { message: 'Portfolio deleted' };
  }
}
