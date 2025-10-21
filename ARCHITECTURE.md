# Arquitetura do Sistema de Pagamentos

## Visão Geral

Este documento descreve a arquitetura técnica da API de Sistema de Pagamentos, incluindo decisões de design, padrões utilizados e fluxos de dados.

## Arquitetura em Camadas

A aplicação segue uma arquitetura em camadas baseada no padrão MVC adaptado para NestJS:

```
┌─────────────────────────────────────────┐
│         Controllers Layer               │
│  (Validação de entrada, HTTP handling)  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Services Layer                 │
│     (Lógica de negócio)                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       Repository Layer (TypeORM)        │
│    (Acesso e persistência de dados)     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Database (PostgreSQL)          │
└─────────────────────────────────────────┘
```

## Módulos

### 1. Customers Module
Responsável pelo gerenciamento de clientes.

**Componentes:**
- `CustomersController`: Endpoints REST
- `CustomersService`: Lógica de negócio
- `Customer Entity`: Modelo de dados
- `DTOs`: Validação de entrada/saída

**Regras de Negócio:**
- E-mail único por cliente
- Documento (CPF/CNPJ) único por cliente
- Validação de formato de telefone e documento

### 2. Charges Module
Responsável pelo gerenciamento de cobranças.

**Componentes:**
- `ChargesController`: Endpoints REST
- `ChargesService`: Lógica de negócio
- `Charge Entity`: Modelo de dados
- `DTOs`: Validação de entrada/saída
- `Enums`: PaymentMethod, ChargeStatus

**Regras de Negócio:**
- Cobrança sempre vinculada a um cliente existente
- Validações específicas por método de pagamento
- Controle de transições de status
- Geração de dados de pagamento (QR Code, código de barras, etc.)

## Padrões de Design

### 1. Dependency Injection
NestJS utiliza injeção de dependências para desacoplar componentes e facilitar testes.

```typescript
@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(Charge)
    private readonly chargeRepository: Repository<Charge>,
    private readonly customersService: CustomersService,
  ) {}
}
```

### 2. Repository Pattern
TypeORM implementa o padrão Repository para abstração do acesso a dados.

### 3. DTO Pattern
Data Transfer Objects para validação e transformação de dados.

```typescript
export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  // ...
}
```

### 4. Interceptors
Utilizado para cross-cutting concerns como idempotência.

```typescript
@UseInterceptors(IdempotencyInterceptor)
export class CustomersController { }
```

## Fluxo de Dados

### Criação de Cobrança

```
1. Cliente faz POST /charges
   ↓
2. Controller recebe e valida DTO
   ↓
3. IdempotencyInterceptor verifica chave
   ↓
4. ChargesService.create()
   ├─ Valida se cliente existe
   ├─ Valida dados do método de pagamento
   ├─ Gera dados específicos (QR Code, etc.)
   └─ Salva no banco
   ↓
5. Retorna resposta HTTP 201
```

## Validações

### Camadas de Validação

1. **Validação de Tipo (class-validator)**
   - Executada automaticamente pelo ValidationPipe
   - Valida tipos, formatos e constraints

2. **Validação de Negócio (Services)**
   - Unicidade de e-mail/documento
   - Existência de relacionamentos
   - Transições de status válidas

3. **Validação Condicional**
   - Campos específicos por método de pagamento
   - Utiliza `ValidateIf` do class-validator

## Tratamento de Erros

### Global Exception Filter

Todos os erros são capturados por um filtro global que padroniza as respostas:

```typescript
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "timestamp": "2025-10-21T10:00:00.000Z"
}
```

### Tipos de Exceções

- `NotFoundException`: Recurso não encontrado (404)
- `ConflictException`: Duplicidade de dados (409)
- `BadRequestException`: Validação falhou (400)
- `InternalServerErrorException`: Erro interno (500)

## Idempotência

Implementada através de um interceptor que:

1. Captura o header `idempotency-key`
2. Verifica se já existe resposta para essa chave
3. Retorna resposta cached ou executa a requisição
4. Armazena resultado por 24h

**Nota:** Em produção, usar Redis ao invés de Map em memória.

## Segurança

### Implementado

- ✅ Validação de entrada (class-validator)
- ✅ Whitelist de propriedades no ValidationPipe
- ✅ CORS habilitado
- ✅ Sanitização de dados sensíveis (apenas últimos 4 dígitos do cartão)

### Recomendações para Produção

- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Criptografia de dados sensíveis
- [ ] HTTPS obrigatório
- [ ] Logs de auditoria
- [ ] Sanitização contra SQL Injection (TypeORM já previne)

## Banco de Dados

### Estratégia de Relacionamento

```sql
Customer (1) ──< (N) Charge
```

- Um cliente pode ter múltiplas cobranças
- Uma cobrança pertence a apenas um cliente
- Cascade DELETE: ao remover cliente, remove cobranças

### Índices Recomendados

```sql
-- Já criados automaticamente por UNIQUE
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
CREATE UNIQUE INDEX idx_customers_document ON customers(document);

-- Recomendados para performance
CREATE INDEX idx_charges_customer_id ON charges(customer_id);
CREATE INDEX idx_charges_status ON charges(status);
CREATE INDEX idx_charges_payment_method ON charges(payment_method);
CREATE INDEX idx_charges_created_at ON charges(created_at);
```

## Escalabilidade

### Considerações

1. **Banco de Dados**
   - Connection pooling configurado no TypeORM
   - Possibilidade de read replicas
   - Índices otimizados

2. **Cache**
   - Implementar Redis para idempotência
   - Cache de consultas frequentes
   - Session storage

3. **Horizontal Scaling**
   - Stateless application (exceto idempotency store)
   - Load balancer compatível
   - Externalizar idempotency store

4. **Monitoring**
   - Logs estruturados
   - Métricas de performance
   - Health checks

## Testes

### Estratégia de Testes

```
Unit Tests (Services)
  ↓
Integration Tests (Controllers + Services)
  ↓
E2E Tests (API completa)
```

### Cobertura Recomendada

- Services: 80%+ de cobertura
- Controllers: Testes de integração
- E2E: Fluxos principais

## Melhorias Futuras

### Funcionalidades

1. **Webhooks**
   - Notificar clientes sobre mudanças de status
   - Retry mechanism com exponential backoff

2. **Processamento Assíncrono**
   - Fila para processamento de pagamentos
   - Bull/BullMQ para job processing

3. **Multi-tenancy**
   - Suporte a múltiplas empresas
   - Isolamento de dados

4. **Relatórios**
   - Dashboard de cobranças
   - Exportação de relatórios
   - Métricas financeiras

### Técnicas

1. **Event Sourcing**
   - Histórico completo de mudanças
   - Audit trail

2. **CQRS**
   - Separação de leitura e escrita
   - Otimização de queries

3. **Microserviços**
   - Separar customers e charges
   - Gateway API

## Deployment

### Docker

Aplicação containerizada com:
- Node.js Alpine (imagem leve)
- Multi-stage build
- Health checks

### Variáveis de Ambiente

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=payment_system
PORT=3000
```

### CI/CD Recomendado

```
Git Push
  ↓
Lint + Tests
  ↓
Build Docker Image
  ↓
Push to Registry
  ↓
Deploy to Staging
  ↓
E2E Tests
  ↓
Deploy to Production
```

## Monitoramento

### Métricas Importantes

- Request rate
- Response time
- Error rate
- Database connection pool
- Memory usage
- CPU usage

### Ferramentas Recomendadas

- **Logs**: Winston + ELK Stack
- **Metrics**: Prometheus + Grafana
- **APM**: New Relic / Datadog
- **Error Tracking**: Sentry

---

**Última atualização:** Outubro 2025

