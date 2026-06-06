import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Project Request')
@ApiBearerAuth()
@Controller('request')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({ summary: 'Buat project request ke freelancer (Client)' })
  @UseGuards(RolesGuard)
  @Roles('CLIENT')
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateRequestDto) {
    return this.requestService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'Lihat semua request (Auth)' })
  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @ApiOperation({ summary: 'Lihat request yang saya buat sebagai Client' })
  @UseGuards(RolesGuard)
  @Roles('CLIENT')
  @Get('client')
  findByClient(@CurrentUser() user: any) {
    return this.requestService.findByClient(user.id);
  }

  @ApiOperation({ summary: 'Lihat request yang ditujukan ke saya sebagai Freelancer' })
  @UseGuards(RolesGuard)
  @Roles('FREELANCER')
  @Get('freelancer')
  findByFreelancer(@CurrentUser() user: any) {
    return this.requestService.findByFreelancer(user.id);
  }

  @ApiOperation({ summary: 'Update status request' })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.requestService.updateStatus(id, user.id, dto);
  }
}
