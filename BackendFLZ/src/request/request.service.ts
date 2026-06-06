import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const userSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  role: true,
  phone: true,
};

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async create(clientId: number, dto: CreateRequestDto) {
    const freelancer = await this.db.user.findUnique({
      where: { id: dto.freelancerId },
    });
    if (!freelancer || freelancer.role !== 'FREELANCER') {
      throw new NotFoundException('Freelancer not found');
    }

    const request = await this.db.projectRequest.create({
      data: {
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        clientId,
        freelancerId: dto.freelancerId,
      },
      include: {
        client: { select: userSelect },
        freelancer: { select: userSelect },
      },
    });

    return { message: 'Request created successfully', request };
  }

  async findAll() {
    return this.db.projectRequest.findMany({
      include: {
        client: { select: userSelect },
        freelancer: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByClient(clientId: number) {
    return this.db.projectRequest.findMany({
      where: { clientId },
      include: {
        client: { select: userSelect },
        freelancer: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFreelancer(freelancerId: number) {
    return this.db.projectRequest.findMany({
      where: { freelancerId },
      include: {
        client: { select: userSelect },
        freelancer: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, userId: number, dto: UpdateStatusDto) {
    const request = await this.db.projectRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    
    const isParticipant = request.clientId === userId || request.freelancerId === userId;
    if (!isParticipant) {
      throw new ForbiddenException(
        'Only the request participants can update the status',
      );
    }

    const updated = await this.db.projectRequest.update({
      where: { id },
      data: { status: dto.status },
      include: {
        client: { select: userSelect },
        freelancer: { select: userSelect },
      },
    });

    return { message: 'Status updated successfully', request: updated };
  }
}
