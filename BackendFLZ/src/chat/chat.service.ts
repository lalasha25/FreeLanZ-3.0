import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  private async verifyAccess(requestId: number, userId: number) {
    const request = await this.db.projectRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Project request not found');

    const isParticipant =
      request.clientId === userId || request.freelancerId === userId;
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant of this request',
      );
    }
    return request;
  }

  async sendMessage(senderId: number, dto: CreateChatDto) {
    await this.verifyAccess(dto.requestId, senderId);

    const chat = await this.db.chatMessage.create({
      data: {
        message: dto.message,
        requestId: dto.requestId,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        request: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    return { message: 'Message sent', chat };
  }

  async findAll(userId: number) {
    return this.db.chatMessage.findMany({
      where: {
        request: {
          OR: [{ clientId: userId }, { freelancerId: userId }],
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        request: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByRequest(requestId: number, userId: number) {
    await this.verifyAccess(requestId, userId);

    return this.db.chatMessage.findMany({
      where: { requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
