# 🚀 Quick Start

Guia rápido para começar a usar a API em 5 minutos.

## Opção 1: Docker (Mais Rápido)

### 1. Inicie os containers

```bash
docker-compose up -d
```

### 2. Acesse a aplicação

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

**Pronto!** A API já está funcionando.

## Opção 2: Desenvolvimento Local

### 1. Instale as dependências

```bash
npm install
```

### 2. Inicie o PostgreSQL

```bash
# Usando o script
./scripts/start-db.sh

# Ou usando Docker Compose
docker-compose up -d postgres
```

### 3. Inicie a aplicação

```bash
npm run start:dev
```

### 4. Acesse a aplicação

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Testando a API

### Via Swagger (Interface Visual)

1. Acesse http://localhost:3000/api/docs
2. Clique em "Try it out" em qualquer endpoint
3. Preencha os dados e clique em "Execute"

### Via curl

```bash
# 1. Criar um cliente
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "document": "12345678900",
    "phone": "11987654321"
  }'

# Salve o "id" retornado (CUSTOMER_ID)

# 2. Criar uma cobrança Pix
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 100.00,
    "paymentMethod": "pix",
    "description": "Meu primeiro Pix"
  }'
```

### Script Automático

```bash
# Testa todos os endpoints
./scripts/test-api.sh
```

## Próximos Passos

1. **Explore a API**: Use o Swagger em `/api/docs`
2. **Veja exemplos**: Leia o arquivo `API_EXAMPLES.md`
3. **Entenda a arquitetura**: Consulte `ARCHITECTURE.md`
4. **Leia a documentação completa**: Veja `README.md`

## Problemas Comuns

### Porta 3000 já em uso

```bash
# Defina outra porta
PORT=3001 npm run start:dev
```

### Banco de dados não conecta

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Veja os logs
docker-compose logs go_db

# Reinicie o banco
docker-compose restart go_db
```

### Erro de permissão nos scripts

```bash
chmod +x scripts/*.sh
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev      # Inicia com hot reload

# Produção
npm run build          # Compila o projeto
npm run start:prod     # Inicia em produção

# Docker
docker-compose up -d   # Inicia todos os serviços
docker-compose down    # Para todos os serviços
docker-compose logs -f # Visualiza logs

# Banco de dados
./scripts/start-db.sh  # Inicia apenas o PostgreSQL
```

## Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Health check |
| POST | `/customers` | Criar cliente |
| GET | `/customers` | Listar clientes |
| POST | `/charges` | Criar cobrança |
| GET | `/charges` | Listar cobranças |

## Métodos de Pagamento

### Pix
```json
{
  "paymentMethod": "pix",
  "paymentDetails": {
    "pixExpiration": "2025-10-22T23:59:59Z"
  }
}
```

### Cartão de Crédito
```json
{
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "cardHolderName": "JOAO SILVA",
    "cardExpiration": "12/2028",
    "cardCvv": "123",
    "installments": 3
  }
}
```

### Boleto
```json
{
  "paymentMethod": "bank_slip",
  "paymentDetails": {
    "bankSlipDueDate": "2025-10-30"
  }
}
```

## Suporte

- 📚 **Documentação Completa**: `README.md`
- 🏗️ **Arquitetura**: `ARCHITECTURE.md`
- 📋 **Exemplos**: `API_EXAMPLES.md`
- 📝 **Changelog**: `CHANGELOG.md`
- 🌐 **Swagger**: http://localhost:3000/api/docs

---

**Dúvidas?** Consulte a documentação completa no `README.md`

