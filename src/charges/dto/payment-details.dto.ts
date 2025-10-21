import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';

export class PaymentDetailsDto {
  // Campos para PIX
  @ApiProperty({
    description: 'Data de expiração do Pix (ISO 8601)',
    example: '2025-10-22T23:59:59Z',
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.PIX)
  @IsOptional()
  @IsDateString()
  pixExpiration?: string;

  // Campos para Cartão de Crédito
  @ApiProperty({
    description: 'Número do cartão de crédito',
    example: '4111111111111111',
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @Matches(/^[0-9]{13,19}$/, {
    message: 'Número do cartão deve conter entre 13 e 19 dígitos',
  })
  cardNumber?: string;

  @ApiProperty({
    description: 'Nome do titular do cartão',
    example: 'JOAO DA SILVA',
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  cardHolderName?: string;

  @ApiProperty({
    description: 'Data de validade do cartão (MM/YYYY)',
    example: '12/2028',
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, {
    message: 'Data de validade deve estar no formato MM/YYYY',
  })
  cardExpiration?: string;

  @ApiProperty({
    description: 'CVV do cartão',
    example: '123',
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @Matches(/^[0-9]{3,4}$/, {
    message: 'CVV deve conter 3 ou 4 dígitos',
  })
  cardCvv?: string;

  @ApiProperty({
    description: 'Número de parcelas (1 a 12)',
    example: 1,
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Número mínimo de parcelas é 1' })
  @Max(12, { message: 'Número máximo de parcelas é 12' })
  installments?: number;

  // Campos para Boleto
  @ApiProperty({
    description: 'Data de vencimento do boleto (YYYY-MM-DD)',
    example: '2025-10-30',
    required: false,
  })
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.BANK_SLIP)
  @IsDateString()
  bankSlipDueDate?: string;
}

