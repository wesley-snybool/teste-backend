#!/bin/bash

# Script para testar todos os endpoints da API

API_URL="${API_URL:-http://localhost:3000}"

echo "🧪 Testando API do Sistema de Pagamentos"
echo "📍 URL: $API_URL"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local data=$4
  local expected_status=$5
  
  echo -e "${BLUE}[TEST]${NC} $description"
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "idempotency-key: $(uuidgen 2>/dev/null || echo $(date +%s))" \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" == "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Status: $http_code)"
  else
    echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $http_code)"
  fi
  
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
  echo ""
  
  # Retorna o body para uso posterior
  echo "$body"
}

# 1. Health Check
echo "═══════════════════════════════════════"
echo "1. Health Check"
echo "═══════════════════════════════════════"
test_endpoint "GET" "/" "Health check" "" "200" > /dev/null

# 2. Criar Cliente
echo "═══════════════════════════════════════"
echo "2. Criar Cliente"
echo "═══════════════════════════════════════"
customer_response=$(test_endpoint "POST" "/customers" "Criar cliente" '{
  "name": "Teste API",
  "email": "teste@example.com",
  "document": "12345678900",
  "phone": "11987654321"
}' "201")

CUSTOMER_ID=$(echo "$customer_response" | jq -r '.id' 2>/dev/null)

if [ "$CUSTOMER_ID" == "null" ] || [ -z "$CUSTOMER_ID" ]; then
  echo -e "${RED}✗ Erro ao obter ID do cliente. Abortando testes.${NC}"
  exit 1
fi

echo -e "${GREEN}Customer ID obtido: $CUSTOMER_ID${NC}"
echo ""

# 3. Listar Clientes
echo "═══════════════════════════════════════"
echo "3. Listar Clientes"
echo "═══════════════════════════════════════"
test_endpoint "GET" "/customers" "Listar todos os clientes" "" "200" > /dev/null

# 4. Buscar Cliente por ID
echo "═══════════════════════════════════════"
echo "4. Buscar Cliente"
echo "═══════════════════════════════════════"
test_endpoint "GET" "/customers/$CUSTOMER_ID" "Buscar cliente por ID" "" "200" > /dev/null

# 5. Criar Cobrança Pix
echo "═══════════════════════════════════════"
echo "5. Criar Cobrança Pix"
echo "═══════════════════════════════════════"
pix_response=$(test_endpoint "POST" "/charges" "Criar cobrança Pix" "{
  \"customerId\": \"$CUSTOMER_ID\",
  \"amount\": 150.00,
  \"paymentMethod\": \"pix\",
  \"description\": \"Teste Pix\"
}" "201")

PIX_CHARGE_ID=$(echo "$pix_response" | jq -r '.id' 2>/dev/null)

# 6. Criar Cobrança Cartão
echo "═══════════════════════════════════════"
echo "6. Criar Cobrança Cartão de Crédito"
echo "═══════════════════════════════════════"
card_response=$(test_endpoint "POST" "/charges" "Criar cobrança com cartão" "{
  \"customerId\": \"$CUSTOMER_ID\",
  \"amount\": 500.00,
  \"paymentMethod\": \"credit_card\",
  \"description\": \"Teste Cartão\",
  \"paymentDetails\": {
    \"cardNumber\": \"4111111111111111\",
    \"cardHolderName\": \"TESTE API\",
    \"cardExpiration\": \"12/2028\",
    \"cardCvv\": \"123\",
    \"installments\": 3
  }
}" "201")

CARD_CHARGE_ID=$(echo "$card_response" | jq -r '.id' 2>/dev/null)

# 7. Criar Cobrança Boleto
echo "═══════════════════════════════════════"
echo "7. Criar Cobrança Boleto"
echo "═══════════════════════════════════════"
slip_response=$(test_endpoint "POST" "/charges" "Criar cobrança com boleto" "{
  \"customerId\": \"$CUSTOMER_ID\",
  \"amount\": 250.00,
  \"paymentMethod\": \"bank_slip\",
  \"description\": \"Teste Boleto\",
  \"paymentDetails\": {
    \"bankSlipDueDate\": \"2025-12-31\"
  }
}" "201")

# 8. Listar Cobranças
echo "═══════════════════════════════════════"
echo "8. Listar Cobranças"
echo "═══════════════════════════════════════"
test_endpoint "GET" "/charges" "Listar todas as cobranças" "" "200" > /dev/null

# 9. Listar Cobranças do Cliente
echo "═══════════════════════════════════════"
echo "9. Listar Cobranças do Cliente"
echo "═══════════════════════════════════════"
test_endpoint "GET" "/charges?customerId=$CUSTOMER_ID" "Listar cobranças do cliente" "" "200" > /dev/null

# 10. Atualizar Status da Cobrança
if [ "$PIX_CHARGE_ID" != "null" ] && [ -n "$PIX_CHARGE_ID" ]; then
  echo "═══════════════════════════════════════"
  echo "10. Atualizar Status da Cobrança"
  echo "═══════════════════════════════════════"
  test_endpoint "PATCH" "/charges/$PIX_CHARGE_ID" "Marcar cobrança como paga" '{
    "status": "paid"
  }' "200" > /dev/null
fi

# 11. Testar Validação (deve falhar)
echo "═══════════════════════════════════════"
echo "11. Testar Validações"
echo "═══════════════════════════════════════"
test_endpoint "POST" "/customers" "E-mail duplicado (deve falhar)" '{
  "name": "Outro Nome",
  "email": "teste@example.com",
  "document": "99999999999",
  "phone": "11987654321"
}' "409" > /dev/null

test_endpoint "POST" "/charges" "Cliente inexistente (deve falhar)" '{
  "customerId": "00000000-0000-0000-0000-000000000000",
  "amount": 100.00,
  "paymentMethod": "pix"
}' "404" > /dev/null

# Resumo
echo "═══════════════════════════════════════"
echo "✅ Testes concluídos!"
echo "═══════════════════════════════════════"
echo ""
echo "📝 Recursos criados:"
echo "   Customer ID: $CUSTOMER_ID"
echo "   Pix Charge ID: $PIX_CHARGE_ID"
echo "   Card Charge ID: $CARD_CHARGE_ID"
echo ""
echo "🌐 Documentação Swagger: $API_URL/api/docs"

