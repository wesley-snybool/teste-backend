import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@ApiTags('Charges')
@Controller('charges')
@UseInterceptors(IdempotencyInterceptor)
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova cobrança' })
  @ApiResponse({ status: 201, description: 'Cobrança criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiHeader({
    name: 'idempotency-key',
    description: 'Chave de idempotência (UUID)',
    required: false,
  })
  create(@Body() createChargeDto: CreateChargeDto) {
    return this.chargesService.create(createChargeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as cobranças' })
  @ApiQuery({
    name: 'customerId',
    description: 'Filtrar cobranças por ID do cliente',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Lista de cobranças' })
  findAll(@Query('customerId') customerId?: string) {
    return this.chargesService.findAll(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cobrança por ID' })
  @ApiParam({ name: 'id', description: 'ID da cobrança (UUID)' })
  @ApiResponse({ status: 200, description: 'Cobrança encontrada' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  findOne(@Param('id') id: string) {
    return this.chargesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status de uma cobrança' })
  @ApiParam({ name: 'id', description: 'ID da cobrança (UUID)' })
  @ApiResponse({ status: 200, description: 'Cobrança atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  update(@Param('id') id: string, @Body() updateChargeDto: UpdateChargeDto) {
    return this.chargesService.update(id, updateChargeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma cobrança' })
  @ApiParam({ name: 'id', description: 'ID da cobrança (UUID)' })
  @ApiResponse({ status: 204, description: 'Cobrança removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  remove(@Param('id') id: string) {
    return this.chargesService.remove(id);
  }
}

