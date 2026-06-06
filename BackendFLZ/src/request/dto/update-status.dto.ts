import { IsEnum, IsNotEmpty } from 'class-validator';

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
