import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tambah portofolio baru (Freelancer)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'Lihat semua portofolio (public)' })
  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat portofolio milik saya (Freelancer)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  @Get('me')
  findMine(@CurrentUser() user: any) {
    return this.portfolioService.findMine(user.id);
  }

  @ApiOperation({ summary: 'Lihat portofolio milik freelancer tertentu (public)' })
  @Get('freelancer/:freelancerId')
  findByFreelancer(@Param('freelancerId', ParseIntPipe) freelancerId: number) {
    return this.portfolioService.findByFreelancer(freelancerId);
  }

  @ApiOperation({ summary: 'Lihat detail portofolio (public)' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit portofolio (Freelancer)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.update(id, user.id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus portofolio (Freelancer)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.portfolioService.remove(id, user.id);
  }
}
