import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Lihat semua freelancer (public)' })
  @Get('freelancers')
  findFreelancers() {
    return this.userService.findFreelancers();
  }

  @ApiOperation({ summary: 'Lihat semua client (public)' })
  @Get('clients')
  findClients() {
    return this.userService.findClients();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat detail user berdasarkan ID (Auth)' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
