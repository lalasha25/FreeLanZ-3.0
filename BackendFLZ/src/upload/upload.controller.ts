import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const ALLOWED_IMAGE_TYPES = /\.(jpg|jpeg|png|gif|webp)$/i;
const ALLOWED_DOC_TYPES = /\.(pdf|jpg|jpeg|png)$/i;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function storageConfig(folder: string) {
  return diskStorage({
    destination: join(process.cwd(), 'uploads', folder),
    filename: (_req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
}

function fileFilter(allowedRegex: RegExp) {
  return (_req: any, file: Express.Multer.File, cb: any) => {
    if (!allowedRegex.test(extname(file.originalname))) {
      return cb(
        new BadRequestException(
          `Invalid file type. Allowed: ${allowedRegex.toString()}`,
        ),
        false,
      );
    }
    cb(null, true);
  };
}

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload foto identitas/KTP (JPG, PNG, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('id-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('id-photos'),
      fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadIdPhoto(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.saveIdPhoto(user.id, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload CV (PDF, JPG, PNG, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('cv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('cvs'),
      fileFilter: fileFilter(ALLOWED_DOC_TYPES),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadCv(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.saveCv(user.id, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload gambar portofolio (JPG, PNG, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('portfolio')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('portfolios'),
      fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadPortfolio(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.savePortfolioImage(user.id, file);
  }

  @ApiOperation({ summary: 'Upload foto identitas secara publik untuk registrasi (JPG, PNG, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('public/id-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('id-photos'),
      fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadPublicIdPhoto(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const fileUrl = `/uploads/id-photos/${file.filename}`;
    return {
      message: 'ID photo uploaded successfully',
      url: fileUrl,
    };
  }

  @ApiOperation({ summary: 'Upload project proposal secara publik untuk registrasi (PDF, JPG, PNG, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('public/portfolio')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('portfolios'),
      fileFilter: fileFilter(ALLOWED_DOC_TYPES),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadPublicPortfolio(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const fileUrl = `/uploads/portfolios/${file.filename}`;
    return {
      message: 'Portfolio file uploaded successfully',
      url: fileUrl,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload foto profil / avatar (JPG, PNG, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('id-photos'),
      fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.saveAvatar(user.id, file);
  }
}
