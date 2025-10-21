import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@ApiTags('Customers')
@Controller('customers')
@UseInterceptors(IdempotencyInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'E-mail ou documento já cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiHeader({
    name: 'idempotency-key',
    description: 'Chave de idempotência (UUID)',
    required: false,
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente (UUID)' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente (UUID)' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'E-mail ou documento já cadastrado' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente (UUID)' })
  @ApiResponse({ status: 204, description: 'Cliente removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}

