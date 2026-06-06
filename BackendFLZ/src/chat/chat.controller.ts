import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Kirim pesan chat' })
  @Post()
  sendMessage(@CurrentUser() user: any, @Body() dto: CreateChatDto) {
    return this.chatService.sendMessage(user.id, dto);
  }

  @ApiOperation({ summary: 'Lihat semua chat milik user saat ini' })
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.chatService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Lihat chat berdasarkan requestId' })
  @Get(':requestId')
  findByRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() user: any,
  ) {
    return this.chatService.findByRequest(requestId, user.id);
  }
}
