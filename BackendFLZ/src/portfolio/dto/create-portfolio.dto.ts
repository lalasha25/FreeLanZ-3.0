import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  projectUrl?: string;
}
