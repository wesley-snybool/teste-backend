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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Charges')
@ApiBearerAuth()
@Controller('charges')
@UseInterceptors(IdempotencyInterceptor)
@UseGuards(RolesGuard)
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Criar uma nova cobrança (requer autenticação)' })
  @ApiResponse({ status: 201, description: 'Cobrança criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiHeader({
    name: 'idempotency-key',
    description: 'Chave de idempotência (UUID)',
    required: false,
  })
  create(@Body() createChargeDto: CreateChargeDto) {
    return this.chargesService.create(createChargeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Listar todas as cobranças (requer autenticação)' })
  @ApiQuery({
    name: 'customerId',
    description: 'Filtrar cobranças por ID do cliente',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Lista de cobranças' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(@Query('customerId') customerId?: string) {
    return this.chargesService.findAll(customerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Buscar cobrança por ID (requer autenticação)' })
  @ApiParam({ name: 'id', description: 'ID da cobrança (UUID)' })
  @ApiResponse({ status: 200, description: 'Cobrança encontrada' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findOne(@Param('id') id: string) {
    return this.chargesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Atualizar status de uma cobrança (requer autenticação)' })
  @ApiParam({ name: 'id', description: 'ID da cobrança (UUID)' })
  @ApiResponse({ status: 200, description: 'Cobrança atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  update(@Param('id') id: string, @Body() updateChargeDto: UpdateChargeDto) {
    return this.chargesService.update(id, updateChargeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma cobrança (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID da cobrança (UUID)' })
  @ApiResponse({ status: 204, description: 'Cobrança removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (apenas admin)' })
  remove(@Param('id') id: string) {
    return this.chargesService.remove(id);
  }
}

