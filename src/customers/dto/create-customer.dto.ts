import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'E-mail do cliente',
    example: 'joao@example.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do cliente (apenas números)',
    example: '12345678900',
  })
  @IsString()
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  @Matches(/^[0-9]{11,14}$/, {
    message: 'Documento deve conter entre 11 e 14 dígitos numéricos',
  })
  document: string;

  @ApiProperty({
    description: 'Telefone do cliente (com DDD)',
    example: '11987654321',
  })
  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @Matches(/^[0-9]{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos numéricos',
  })
  phone: string;
}

