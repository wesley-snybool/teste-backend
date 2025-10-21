import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ChargeStatus } from '../enums/charge-status.enum';

export class UpdateChargeDto {
  @ApiProperty({
    description: 'Status da cobrança',
    enum: ChargeStatus,
    example: ChargeStatus.PAID,
  })
  @IsOptional()
  @IsEnum(ChargeStatus, {
    message:
      'Status deve ser: pending, paid, failed, expired ou cancelled',
  })
  status?: ChargeStatus;
}

