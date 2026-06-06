import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async saveIdPhoto(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const fileUrl = `/uploads/id-photos/${file.filename}`;
    await this.db.user.update({
      where: { id: userId },
      data: { idPhotoUrl: fileUrl },
    });

    return {
      message: 'ID photo uploaded successfully',
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async saveCv(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const fileUrl = `/uploads/cvs/${file.filename}`;
    await this.db.user.update({
      where: { id: userId },
      data: { cvUrl: fileUrl },
    });

    return {
      message: 'CV uploaded successfully',
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async savePortfolioImage(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const fileUrl = `/uploads/portfolios/${file.filename}`;

    return {
      message: 'Portfolio image uploaded successfully',
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async saveAvatar(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const fileUrl = `/uploads/id-photos/${file.filename}`;
    await this.db.user.update({
      where: { id: userId },
      data: { avatarUrl: fileUrl },
    });

    return {
      message: 'Avatar uploaded successfully',
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
