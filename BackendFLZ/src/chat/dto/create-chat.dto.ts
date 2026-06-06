import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  requestId!: number;
}
