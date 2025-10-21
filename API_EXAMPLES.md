# Exemplos de Requisições API

Este documento contém exemplos práticos de todas as requisições disponíveis na API.

## Variáveis de Ambiente

```bash
export API_URL="http://localhost:3000"
```

## 1. Health Check

### Verificar se a API está funcionando

```bash
curl -X GET $API_URL/
```

**Resposta:**
```json
{
  "message": "Sistema de Pagamentos API",
  "version": "1.0",
  "status": "running",
  "documentation": "/api/docs"
}
```

## 2. Customers (Clientes)

### 2.1. Criar Cliente

```bash
curl -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "name": "João da Silva",
    "email": "joao@example.com",
    "document": "12345678900",
    "phone": "11987654321"
  }'
```

### 2.2. Criar Outro Cliente

```bash
curl -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "document": "98765432100",
    "phone": "21987654321"
  }'
```

### 2.3. Listar Todos os Clientes

```bash
curl -X GET $API_URL/customers
```

### 2.4. Buscar Cliente por ID

```bash
# Substitua CUSTOMER_ID pelo ID retornado na criação
curl -X GET $API_URL/customers/CUSTOMER_ID
```

### 2.5. Atualizar Cliente

```bash
curl -X PATCH $API_URL/customers/CUSTOMER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "11999999999"
  }'
```

### 2.6. Remover Cliente

```bash
curl -X DELETE $API_URL/customers/CUSTOMER_ID
```

### 2.7. Testar Validações (deve falhar)

**E-mail inválido:**
```bash
curl -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "email-invalido",
    "document": "12345678900",
    "phone": "11987654321"
  }'
```

**Documento duplicado:**
```bash
curl -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Outro Nome",
    "email": "outro@example.com",
    "document": "12345678900",
    "phone": "11987654321"
  }'
```

## 3. Charges (Cobranças)

### 3.1. Criar Cobrança com Pix

```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 150.50,
    "currency": "BRL",
    "paymentMethod": "pix",
    "description": "Pagamento de serviço via Pix"
  }'
```

**Com data de expiração customizada:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 200.00,
    "paymentMethod": "pix",
    "description": "Pix com expiração customizada",
    "paymentDetails": {
      "pixExpiration": "2025-10-22T23:59:59Z"
    }
  }'
```

### 3.2. Criar Cobrança com Cartão de Crédito

**À vista:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 500.00,
    "paymentMethod": "credit_card",
    "description": "Compra com cartão à vista",
    "paymentDetails": {
      "cardNumber": "4111111111111111",
      "cardHolderName": "JOAO DA SILVA",
      "cardExpiration": "12/2028",
      "cardCvv": "123"
    }
  }'
```

**Parcelado:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 1200.00,
    "paymentMethod": "credit_card",
    "description": "Compra parcelada em 12x",
    "paymentDetails": {
      "cardNumber": "5555555555554444",
      "cardHolderName": "MARIA SANTOS",
      "cardExpiration": "06/2027",
      "cardCvv": "456",
      "installments": 12
    }
  }'
```

**Diferentes bandeiras:**
```bash
# Visa (começa com 4)
# "cardNumber": "4111111111111111"

# Mastercard (começa com 5)
# "cardNumber": "5555555555554444"

# American Express (começa com 3)
# "cardNumber": "378282246310005"

# Discover (começa com 6)
# "cardNumber": "6011111111111117"
```

### 3.3. Criar Cobrança com Boleto

```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 250.00,
    "paymentMethod": "bank_slip",
    "description": "Mensalidade",
    "paymentDetails": {
      "bankSlipDueDate": "2025-10-30"
    }
  }'
```

### 3.4. Listar Todas as Cobranças

```bash
curl -X GET $API_URL/charges
```

### 3.5. Listar Cobranças de um Cliente

```bash
curl -X GET "$API_URL/charges?customerId=CUSTOMER_ID"
```

### 3.6. Buscar Cobrança por ID

```bash
curl -X GET $API_URL/charges/CHARGE_ID
```

### 3.7. Atualizar Status da Cobrança

**Marcar como pago:**
```bash
curl -X PATCH $API_URL/charges/CHARGE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

**Marcar como falhado:**
```bash
curl -X PATCH $API_URL/charges/CHARGE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "failed"
  }'
```

**Marcar como expirado:**
```bash
curl -X PATCH $API_URL/charges/CHARGE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "expired"
  }'
```

**Marcar como cancelado:**
```bash
curl -X PATCH $API_URL/charges/CHARGE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled"
  }'
```

### 3.8. Remover Cobrança

```bash
curl -X DELETE $API_URL/charges/CHARGE_ID
```

### 3.9. Testar Validações (devem falhar)

**Cliente inexistente:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "00000000-0000-0000-0000-000000000000",
    "amount": 100.00,
    "paymentMethod": "pix"
  }'
```

**Valor inválido:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": -50.00,
    "paymentMethod": "pix"
  }'
```

**Cartão sem dados obrigatórios:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 100.00,
    "paymentMethod": "credit_card"
  }'
```

**Boleto com data passada:**
```bash
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "amount": 100.00,
    "paymentMethod": "bank_slip",
    "paymentDetails": {
      "bankSlipDueDate": "2020-01-01"
    }
  }'
```

**Transição de status inválida (tentar alterar cobrança paga):**
```bash
# Primeiro marque como paga
curl -X PATCH $API_URL/charges/CHARGE_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "paid"}'

# Depois tente alterar novamente (deve falhar)
curl -X PATCH $API_URL/charges/CHARGE_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "failed"}'
```

## 4. Idempotência

### Testar Idempotência

**Primeira requisição:**
```bash
IDEMPOTENCY_KEY=$(uuidgen)
echo "Chave: $IDEMPOTENCY_KEY"

curl -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $IDEMPOTENCY_KEY" \
  -d '{
    "name": "Teste Idempotencia",
    "email": "idempotencia@example.com",
    "document": "11111111111",
    "phone": "11111111111"
  }'
```

**Segunda requisição (mesma chave):**
```bash
# Use a mesma chave da primeira requisição
curl -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $IDEMPOTENCY_KEY" \
  -d '{
    "name": "Dados Diferentes",
    "email": "outro@example.com",
    "document": "22222222222",
    "phone": "22222222222"
  }'
```

**Resultado:** A segunda requisição deve retornar o mesmo resultado da primeira, sem criar um novo cliente.

## 5. Fluxo Completo

### Cenário: Cliente cria conta e faz múltiplas cobranças

```bash
# 1. Criar cliente
CUSTOMER_RESPONSE=$(curl -s -X POST $API_URL/customers \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d '{
    "name": "Cliente VIP",
    "email": "vip@example.com",
    "document": "99999999999",
    "phone": "11999999999"
  }')

echo "Cliente criado: $CUSTOMER_RESPONSE"

# Extrair ID do cliente (usando jq se disponível)
CUSTOMER_ID=$(echo $CUSTOMER_RESPONSE | jq -r '.id')
echo "Customer ID: $CUSTOMER_ID"

# 2. Criar cobrança via Pix
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 100.00,
    \"paymentMethod\": \"pix\",
    \"description\": \"Primeira cobrança\"
  }"

# 3. Criar cobrança via Cartão
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 500.00,
    \"paymentMethod\": \"credit_card\",
    \"description\": \"Segunda cobrança\",
    \"paymentDetails\": {
      \"cardNumber\": \"4111111111111111\",
      \"cardHolderName\": \"CLIENTE VIP\",
      \"cardExpiration\": \"12/2028\",
      \"cardCvv\": \"123\",
      \"installments\": 5
    }
  }"

# 4. Criar cobrança via Boleto
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 250.00,
    \"paymentMethod\": \"bank_slip\",
    \"description\": \"Terceira cobrança\",
    \"paymentDetails\": {
      \"bankSlipDueDate\": \"2025-11-30\"
    }
  }"

# 5. Listar todas as cobranças do cliente
curl -X GET "$API_URL/charges?customerId=$CUSTOMER_ID"
```

## 6. Scripts Úteis

### Script para criar múltiplos clientes de teste

```bash
#!/bin/bash
for i in {1..5}; do
  curl -X POST $API_URL/customers \
    -H "Content-Type: application/json" \
    -H "idempotency-key: $(uuidgen)" \
    -d "{
      \"name\": \"Cliente $i\",
      \"email\": \"cliente$i@example.com\",
      \"document\": \"1234567890$i\",
      \"phone\": \"1198765432$i\"
    }"
  echo ""
done
```

### Script para testar todos os métodos de pagamento

```bash
#!/bin/bash
CUSTOMER_ID="$1"

if [ -z "$CUSTOMER_ID" ]; then
  echo "Uso: $0 <CUSTOMER_ID>"
  exit 1
fi

echo "Criando cobrança Pix..."
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 100.00,
    \"paymentMethod\": \"pix\"
  }"

echo -e "\n\nCriando cobrança Cartão..."
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 200.00,
    \"paymentMethod\": \"credit_card\",
    \"paymentDetails\": {
      \"cardNumber\": \"4111111111111111\",
      \"cardHolderName\": \"TESTE\",
      \"cardExpiration\": \"12/2028\",
      \"cardCvv\": \"123\"
    }
  }"

echo -e "\n\nCriando cobrança Boleto..."
curl -X POST $API_URL/charges \
  -H "Content-Type: application/json" \
  -H "idempotency-key: $(uuidgen)" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 300.00,
    \"paymentMethod\": \"bank_slip\",
    \"paymentDetails\": {
      \"bankSlipDueDate\": \"2025-12-31\"
    }
  }"
```

## 7. Formato de Resposta

### Sucesso

```json
{
  "id": "uuid",
  "field": "value",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

### Erro

```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "timestamp": "2025-10-21T10:00:00.000Z"
}
```

### Erro com Validações

```json
{
  "statusCode": 400,
  "message": [
    "O nome é obrigatório",
    "E-mail inválido"
  ],
  "timestamp": "2025-10-21T10:00:00.000Z"
}
```

---

**Dica:** Use a documentação Swagger em `/api/docs` para testar a API de forma interativa!

