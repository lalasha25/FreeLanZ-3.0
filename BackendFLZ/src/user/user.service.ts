import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async findById(id: number) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const { password: _pw, ...safeUser } = user;

    // Fetch portfolios for the user
    const portfolios = await this.db.portfolio.findMany({
      where: { freelancerId: id },
      orderBy: { createdAt: 'desc' },
    });

    return { ...safeUser, portfolios };
  }

  async findFreelancers() {
    const users = await this.db.user.findMany({
      where: { role: 'FREELANCER' },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u: any) => {
      const { password: _pw, ...safe } = u;
      return safe;
    });
  }

  async findClients() {
    const users = await this.db.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u: any) => {
      const { password: _pw, ...safe } = u;
      return safe;
    });
  }
}
