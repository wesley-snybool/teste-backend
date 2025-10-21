import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentDetailsDto } from './payment-details.dto';

export class CreateChargeDto {
  @ApiProperty({
    description: 'ID do cliente (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'ID do cliente deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório' })
  customerId: string;

  @ApiProperty({
    description: 'Valor da cobrança',
    example: 100.50,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ter no máximo 2 casas decimais' },
  )
  @Min(0.01, { message: 'O valor mínimo é 0.01' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  amount: number;

  @ApiProperty({
    description: 'Moeda da transação',
    example: 'BRL',
    default: 'BRL',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: PaymentMethod.PIX,
  })
  @IsEnum(PaymentMethod, {
    message: 'Método de pagamento deve ser: pix, credit_card ou bank_slip',
  })
  @IsNotEmpty({ message: 'O método de pagamento é obrigatório' })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Descrição da cobrança',
    example: 'Pagamento de serviço',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Detalhes específicos do método de pagamento',
    type: PaymentDetailsDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  @IsOptional()
  paymentDetails?: PaymentDetailsDto;
}

