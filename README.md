# 🧩 Sistema de Pagamentos - API RESTful

API RESTful para gerenciamento de clientes e cobranças com suporte a múltiplos métodos de pagamento: **Pix**, **Cartão de Crédito** e **Boleto Bancário**. Inclui **autenticação JWT** com controle de acesso baseado em roles.

## 📋 Funcionalidades

### 🔐 Autenticação e Autorização
- ✅ Autenticação JWT (JSON Web Tokens)
- ✅ Controle de acesso baseado em roles (admin/user)
- ✅ Refresh tokens para renovação automática
- ✅ Hash de senhas com bcrypt
- ✅ Guard global protegendo todas as rotas
- ✅ Registro e login de usuários

### 👥 Gerenciamento de Usuários
- ✅ Cadastro de usuários com roles (admin/user)
- ✅ Listagem de usuários (apenas admin)
- ✅ Busca de usuário por ID
- ✅ Remoção de usuário (apenas admin)

### 👨‍💼 Gerenciamento de Clientes
- ✅ Cadastro de clientes com validação de duplicidade (e-mail e documento)
- ✅ Listagem de todos os clientes (requer autenticação)
- ✅ Busca de cliente por ID (requer autenticação)
- ✅ Atualização de dados do cliente (requer autenticação)
- ✅ Remoção de cliente (apenas admin)

### 💰 Gerenciamento de Cobranças
- ✅ Criação de cobranças vinculadas a clientes (requer autenticação)
- ✅ Suporte a três métodos de pagamento:
  - **Pix**: com QR Code e prazo de validade
  - **Cartão de Crédito**: com suporte a parcelamento
  - **Boleto Bancário**: com código de barras e data de vencimento
- ✅ Controle de status da cobrança (pendente, pago, falhado, expirado, cancelado)
- ✅ Listagem de cobranças com filtro por cliente (requer autenticação)
- ✅ Busca de cobrança por ID (requer autenticação)
- ✅ Atualização de status da cobrança (requer autenticação)
- ✅ Remoção de cobrança (apenas admin)

### 🛠️ Recursos Técnicos
- ✅ Autenticação JWT com Passport
- ✅ Validações robustas com `class-validator`
- ✅ Tratamento global de erros
- ✅ Idempotência nas requisições POST
- ✅ Documentação interativa com Swagger
- ✅ Persistência em PostgreSQL com TypeORM
- ✅ Docker Compose para facilitar execução

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação com tokens
- **Passport** - Estratégias de autenticação
- **bcrypt** - Hash de senhas
- **Swagger** - Documentação da API
- **Docker** - Containerização
- **class-validator** - Validação de dados

## 📦 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Docker e Docker Compose (opcional, mas recomendado)
- PostgreSQL (caso não use Docker)

## ⚙️ Instalação e Execução

### Opção 1: Usando Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd teste-backend
```

2. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
DATABASE_HOST=teste-backend-db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=1234
DATABASE_NAME=postgres
PORT=3000
JWT_SECRET=your-secret-key-change-in-production-must-be-at-least-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-must-also-be-at-least-32-chars
```

3. **Inicie os containers**
```bash
docker-compose up -d
```

4. **Acesse a aplicação**
- API: http://localhost:3000
- Documentação Swagger: http://localhost:3000/api/docs

### Opção 2: Execução Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd teste-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados PostgreSQL**
```bash
# Certifique-se de ter o PostgreSQL rodando
# Crie um banco de dados chamado 'postgres'
createdb postgres
```

4. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD=1234
DATABASE_NAME=postgres
PORT=3000
JWT_SECRET=your-secret-key-change-in-production-must-be-at-least-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-must-also-be-at-least-32-chars
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run start:dev
```

6. **Acesse a aplicação**
- API: http://localhost:3000
- Documentação Swagger: http://localhost:3000/api/docs

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
```
http://localhost:3000/api/docs
```

### 🔐 Autenticação JWT

A API utiliza autenticação JWT (JSON Web Tokens) para proteger os endpoints. Existem dois tipos de usuários:

- **`admin`**: Acesso total ao sistema (pode deletar recursos)
- **`user`**: Acesso limitado (pode criar e editar, mas não deletar)

#### Fluxo de Autenticação

```
1. Registrar usuário → POST /users
2. Fazer login → POST /auth/login (recebe accessToken e refreshToken)
3. Usar accessToken nas requisições → Header: Authorization: Bearer <token>
4. Renovar token quando expirar → POST /auth/refresh
```

#### Endpoints de Autenticação

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/users` | Registrar novo usuário | Público |
| POST | `/auth/login` | Fazer login | Público |
| POST | `/auth/refresh` | Renovar access token | Público |
| GET | `/users` | Listar usuários | Apenas admin |
| GET | `/users/:id` | Buscar usuário | Autenticado |
| DELETE | `/users/:id` | Remover usuário | Apenas admin |

#### Duração dos Tokens

- **Access Token**: 15 minutos
- **Refresh Token**: 7 dias

### Endpoints Principais

#### Auth & Users

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/users` | Registrar usuário | 🔓 Público |
| POST | `/auth/login` | Login | 🔓 Público |
| POST | `/auth/refresh` | Renovar token | 🔓 Público |
| GET | `/users` | Listar usuários | 🔒 Admin |
| GET | `/users/:id` | Buscar usuário | 🔒 Autenticado |
| DELETE | `/users/:id` | Remover usuário | 🔒 Admin |

#### Customers (Clientes)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/customers` | Criar novo cliente | 🔒 Autenticado |
| GET | `/customers` | Listar todos os clientes | 🔒 Autenticado |
| GET | `/customers/:id` | Buscar cliente por ID | 🔒 Autenticado |
| PATCH | `/customers/:id` | Atualizar cliente | 🔒 Autenticado |
| DELETE | `/customers/:id` | Remover cliente | 🔒 Admin |

#### Charges (Cobranças)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/charges` | Criar nova cobrança | 🔒 Autenticado |
| GET | `/charges` | Listar todas as cobranças | 🔒 Autenticado |
| GET | `/charges?customerId=:id` | Listar cobranças de um cliente | 🔒 Autenticado |
| GET | `/charges/:id` | Buscar cobrança por ID | 🔒 Autenticado |
| PATCH | `/charges/:id` | Atualizar status da cobrança | 🔒 Autenticado |
| DELETE | `/charges/:id` | Remover cobrança | 🔒 Admin |

## 🧪 Exemplos de Uso

### Exemplo Completo com Autenticação

#### 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "senha123",
    "role": "admin"
  }'
```

**Resposta:**
```json
{
  "id": "uuid",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-10-21T...",
  "updatedAt": "2025-10-21T..."
}
```

#### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**💡 Guarde o `accessToken` para usar nas próximas requisições!**

#### 3. Criar um Cliente (com autenticação)

**Importante**: Substitua `YOUR_TOKEN` pelo `accessToken` recebido no login

```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "idempotency-key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "name": "João da Silva",
    "email": "joao@example.com",
    "document": "12345678900",
    "phone": "11987654321"
  }'
```

**⚠️ Sem o header `Authorization`, você receberá erro 401 Unauthorized**

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João da Silva",
  "email": "joao@example.com",
  "document": "12345678900",
  "phone": "11987654321",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

#### 4. Criar Cobrança com Pix (com autenticação)

```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "idempotency-key: 660e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 150.00,
    "currency": "BRL",
    "paymentMethod": "pix",
    "description": "Pagamento de serviço",
    "paymentDetails": {
      "pixExpiration": "2025-10-22T23:59:59Z"
    }
  }'
```

**Resposta:**
```json
{
  "id": "789e4567-e89b-12d3-a456-426614174000",
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "amount": 150.00,
  "currency": "BRL",
  "paymentMethod": "pix",
  "status": "pending",
  "description": "Pagamento de serviço",
  "pixQrCode": "00020126360014BR.GOV.BCB.PIX...",
  "pixExpiration": "2025-10-22T23:59:59.000Z",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

#### 5. Renovar Token (quando expirar)

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Mais Exemplos

#### Criar Cobrança com Cartão de Crédito

```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "idempotency-key: 770e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 500.00,
    "paymentMethod": "credit_card",
    "description": "Compra de produto",
    "paymentDetails": {
      "cardNumber": "4111111111111111",
      "cardHolderName": "JOAO DA SILVA",
      "cardExpiration": "12/2028",
      "cardCvv": "123",
      "installments": 3
    }
  }'
```

#### Criar Cobrança com Boleto

```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "idempotency-key: 880e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 250.00,
    "paymentMethod": "bank_slip",
    "description": "Mensalidade",
    "paymentDetails": {
      "bankSlipDueDate": "2025-10-30"
    }
  }'
```

#### Atualizar Status da Cobrança

```bash
curl -X PATCH http://localhost:3000/charges/789e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "paid"
  }'
```

### 🔓 Testando no Swagger

1. Acesse http://localhost:3000/api/docs
2. Primeiro, registre um usuário em `/users` ou faça login em `/auth/login`
3. Copie o `accessToken` retornado
4. Clique no botão **"Authorize"** (cadeado no topo da página)
5. Cole o token no campo e clique em "Authorize"
6. Agora você pode testar todos os endpoints protegidos diretamente no Swagger!

## 🔐 Segurança e Autenticação

### JWT (JSON Web Tokens)

A API utiliza JWT para autenticação stateless. Os tokens contêm:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1729508400,
  "exp": 1729509300
}
```

### Roles e Permissões

| Role | Permissões |
|------|------------|
| **admin** | Acesso total: pode criar, ler, atualizar e deletar todos os recursos |
| **user** | Acesso limitado: pode criar e editar, mas não deletar recursos |

### Hash de Senhas

- Senhas são hasheadas com **bcrypt** (salt rounds: 10)
- Senhas nunca são retornadas nas respostas da API
- Impossível recuperar senha original (apenas reset)

### Headers de Autenticação

Todas as rotas protegidas requerem:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variáveis de Ambiente de Segurança

**⚠️ IMPORTANTE**: Em produção, use secrets fortes!

```env
JWT_SECRET=use-um-secret-forte-com-pelo-menos-32-caracteres-aqui
JWT_REFRESH_SECRET=outro-secret-diferente-tambem-forte
```

## 🔒 Idempotência

A API suporta idempotência em requisições POST através do header `idempotency-key`:

```bash
-H "idempotency-key: 550e8400-e29b-41d4-a716-446655440000"
```

Se a mesma chave for enviada em múltiplas requisições, a API retornará o resultado da primeira requisição sem executar a operação novamente.

## 🗄️ Modelagem do Banco de Dados

### Entidade: Customer (Cliente)
```
- id: UUID (PK)
- name: VARCHAR(255)
- email: VARCHAR(255) UNIQUE
- document: VARCHAR(20) UNIQUE
- phone: VARCHAR(20)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Entidade: Charge (Cobrança)
```
- id: UUID (PK)
- customer_id: UUID (FK -> Customer)
- amount: DECIMAL(10,2)
- currency: VARCHAR(3)
- payment_method: ENUM (pix, credit_card, bank_slip)
- status: ENUM (pending, paid, failed, expired, cancelled)
- description: TEXT

# Campos específicos do Pix
- pix_qr_code: TEXT
- pix_expiration: TIMESTAMP

# Campos específicos do Cartão
- card_last_digits: VARCHAR(4)
- card_brand: VARCHAR(50)
- installments: INT

# Campos específicos do Boleto
- bank_slip_code: VARCHAR(100)
- bank_slip_due_date: DATE
- bank_slip_url: TEXT

- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## ✅ Validações Implementadas

### Clientes
- Nome: mínimo 3 caracteres, máximo 255
- E-mail: formato válido e único no sistema
- Documento: 11-14 dígitos numéricos (CPF/CNPJ) e único no sistema
- Telefone: 10-11 dígitos numéricos

### Cobranças
- Valor: mínimo 0.01, máximo 2 casas decimais
- Cliente: deve existir no sistema
- Método de pagamento: pix, credit_card ou bank_slip

#### Validações por Método de Pagamento:

**Pix:**
- Data de expiração (opcional, padrão: 24h)

**Cartão de Crédito:**
- Número do cartão: 13-19 dígitos
- Nome do titular: obrigatório
- Data de validade: formato MM/YYYY
- CVV: 3-4 dígitos
- Parcelas: 1-12 (opcional, padrão: 1)

**Boleto:**
- Data de vencimento: obrigatória e deve ser futura

## 🔄 Status das Cobranças

A cobrança pode ter os seguintes status:

- `pending`: Aguardando pagamento
- `paid`: Pagamento confirmado
- `failed`: Pagamento falhou
- `expired`: Cobrança expirou
- `cancelled`: Cobrança cancelada

### Transições Válidas de Status

- `pending` → `paid`, `failed`, `expired`, `cancelled`
- `failed` → `pending`, `cancelled`
- `expired` → `cancelled`
- `paid` e `cancelled` são estados finais (não podem ser alterados)

## 🚨 Tratamento de Erros

A API retorna erros padronizados no formato:

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "timestamp": "2025-10-21T10:00:00.000Z"
}
```

### Códigos de Status HTTP

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validação falhou)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (duplicidade)
- `500` - Internal Server Error

## 🧪 Testando a API

### Via Swagger UI
1. Acesse http://localhost:3000/api/docs
2. Use a interface interativa para testar os endpoints

### Via curl
Veja os exemplos de uso acima

### Via Postman/Insomnia
Importe a coleção do Swagger: http://localhost:3000/api/docs-json

## 🏗️ Estrutura do Projeto

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
├── app.module.ts         # Módulo principal
├── app.controller.ts
├── app.service.ts
└── main.ts               # Bootstrap da aplicação
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm run test
npm run test:e2e
npm run test:cov

# Lint
npm run lint
npm run format
```

## 🐳 Docker

### Subir os serviços
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f app
```

### Parar os serviços
```bash
docker-compose down
```

### Remover volumes (dados do banco)
```bash
docker-compose down -v
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença UNLICENSED.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato.

---

**Desenvolvido com ❤️ usando NestJS**
