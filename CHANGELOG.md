# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-21

### ✨ Adicionado

#### Módulo de Clientes (Customers)
- Endpoint para cadastro de clientes com validação completa
- Validação de unicidade de e-mail e documento
- Validação de formato de CPF/CNPJ (11-14 dígitos)
- Validação de telefone brasileiro
- Endpoints CRUD completos (Create, Read, Update, Delete)
- Relacionamento one-to-many com cobranças

#### Módulo de Cobranças (Charges)
- Endpoint para criação de cobranças vinculadas a clientes
- Suporte a três métodos de pagamento:
  - **Pix**: Geração de QR Code e controle de expiração
  - **Cartão de Crédito**: Suporte a parcelamento (1-12x), detecção de bandeira, armazenamento seguro
  - **Boleto Bancário**: Geração de código de barras, URL de visualização, controle de vencimento
- Controle de status da cobrança:
  - `pending`: Aguardando pagamento
  - `paid`: Pagamento confirmado
  - `failed`: Pagamento falhou
  - `expired`: Cobrança expirou
  - `cancelled`: Cobrança cancelada
- Validação de transições de status
- Filtro de cobranças por cliente
- Validações específicas por método de pagamento

#### Recursos Técnicos
- Validações robustas com `class-validator` e `class-transformer`
- Tratamento global de erros com filtro customizado
- Idempotência em requisições POST via header `idempotency-key`
- Documentação interativa com Swagger UI
- Persistência em PostgreSQL com TypeORM
- Migrations automáticas (synchronize em desenvolvimento)
- Docker Compose para facilitar execução
- CORS habilitado
- Logs estruturados

#### Documentação
- README.md completo com instruções de instalação e uso
- ARCHITECTURE.md com decisões técnicas e padrões
- API_EXAMPLES.md com exemplos práticos de todas as requisições
- Scripts auxiliares:
  - `scripts/start-db.sh`: Inicia apenas o banco de dados
  - `scripts/test-api.sh`: Testa todos os endpoints automaticamente
- Swagger disponível em `/api/docs`
- Health check endpoint em `/`

#### Segurança
- Validação de entrada em todas as requisições
- Whitelist de propriedades no ValidationPipe
- Sanitização de dados sensíveis (apenas últimos 4 dígitos do cartão)
- Prevenção contra SQL Injection via TypeORM
- Validação de UUIDs em parâmetros de URL

#### Banco de Dados
- Modelagem relacional com TypeORM
- Entidade Customer com campos únicos (email, document)
- Entidade Charge com suporte a dados específicos por método
- Relacionamento one-to-many com cascade delete
- Índices únicos para performance
- Timestamps automáticos (createdAt, updatedAt)

### 🏗️ Estrutura do Projeto
```
src/
├── charges/              # Módulo de cobranças
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # Entidades do TypeORM
│   ├── enums/            # Enumeradores
│   ├── charges.controller.ts
│   ├── charges.service.ts
│   └── charges.module.ts
├── customers/            # Módulo de clientes
│   ├── dto/
│   ├── entities/
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   └── customers.module.ts
├── common/               # Recursos compartilhados
│   ├── filters/          # Filtros de exceção
│   └── interceptors/     # Interceptors (idempotência)
├── config/               # Configurações
│   └── database.config.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

### 🧪 Testes
- Estrutura preparada para testes unitários e E2E
- Scripts de teste automático de endpoints
- Validação de cenários de erro

### 📦 Dependências Principais
- NestJS 11.x
- TypeScript 5.x
- TypeORM 0.3.x
- PostgreSQL (pg)
- class-validator
- class-transformer
- @nestjs/swagger
- uuid

### 🐳 Docker
- Dockerfile otimizado com Node.js Alpine
- Docker Compose com PostgreSQL 15
- Volumes persistentes para banco de dados
- Rede isolada para comunicação entre containers

### 📝 Endpoints Implementados

#### Customers
- `POST /customers` - Criar cliente
- `GET /customers` - Listar clientes
- `GET /customers/:id` - Buscar cliente
- `PATCH /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Remover cliente

#### Charges
- `POST /charges` - Criar cobrança
- `GET /charges` - Listar cobranças
- `GET /charges?customerId=:id` - Filtrar por cliente
- `GET /charges/:id` - Buscar cobrança
- `PATCH /charges/:id` - Atualizar status
- `DELETE /charges/:id` - Remover cobrança

#### Health
- `GET /` - Health check

### 🎯 Próximas Versões (Planejado)

#### [1.1.0] - Autenticação e Autorização
- [ ] Implementar autenticação JWT
- [ ] Criar módulo de usuários
- [ ] Adicionar roles e permissões
- [ ] Proteger endpoints com guards

#### [1.2.0] - Webhooks e Notificações
- [ ] Sistema de webhooks para mudanças de status
- [ ] Retry mechanism com exponential backoff
- [ ] Notificações por e-mail
- [ ] Templates de e-mail customizáveis

#### [1.3.0] - Processamento Assíncrono
- [ ] Implementar fila de processamento (Bull/BullMQ)
- [ ] Redis para cache e idempotência
- [ ] Processamento em background
- [ ] Dashboard de jobs

#### [1.4.0] - Relatórios e Analytics
- [ ] Dashboard de métricas
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Gráficos de cobranças
- [ ] Relatórios financeiros

#### [2.0.0] - Melhorias Avançadas
- [ ] Event Sourcing
- [ ] CQRS
- [ ] Multi-tenancy
- [ ] Microserviços

### 🐛 Correções
- N/A (primeira versão)

### 🔄 Alterações
- N/A (primeira versão)

### ⚠️ Descontinuado
- N/A (primeira versão)

### 🗑️ Removido
- N/A (primeira versão)

---

## Como Usar Este Changelog

### Tipos de Mudanças
- `✨ Adicionado` para novas funcionalidades
- `🔄 Alterações` para mudanças em funcionalidades existentes
- `⚠️ Descontinuado` para funcionalidades que serão removidas
- `🗑️ Removido` para funcionalidades removidas
- `🐛 Correções` para correção de bugs
- `🔒 Segurança` para vulnerabilidades corrigidas

### Versionamento
- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções de bugs compatíveis

