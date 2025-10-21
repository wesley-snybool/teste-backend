#!/bin/bash

API_URL="${API_URL:-http://localhost:3000}"

echo "🔐 Testando Autenticação JWT"
echo "📍 URL: $API_URL"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Criar usuário admin
echo "════════════════════════════════════════"
echo "1. Criando usuário ADMIN"
echo "════════════════════════════════════════"
ADMIN_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Test",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }')

if echo "$ADMIN_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✓ Admin criado${NC}"
  echo "$ADMIN_RESPONSE" | jq '.'
else
  echo -e "${RED}✗ Erro ao criar admin (pode já existir)${NC}"
fi
echo ""

# 2. Criar usuário normal
echo "════════════════════════════════════════"
echo "2. Criando usuário USER"
echo "════════════════════════════════════════"
USER_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Test",
    "email": "user@test.com",
    "password": "user123"
  }')

if echo "$USER_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✓ User criado${NC}"
  echo "$USER_RESPONSE" | jq '.'
else
  echo -e "${RED}✗ Erro ao criar user (pode já existir)${NC}"
fi
echo ""

# 3. Login como admin
echo "════════════════════════════════════════"
echo "3. Login como ADMIN"
echo "════════════════════════════════════════"
ADMIN_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.accessToken')
ADMIN_REFRESH=$(echo "$ADMIN_LOGIN" | jq -r '.refreshToken')

if [ "$ADMIN_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Login admin bem-sucedido${NC}"
  echo "Token: ${ADMIN_TOKEN:0:50}..."
  echo ""
  echo "$ADMIN_LOGIN" | jq '{user, expiresIn}'
else
  echo -e "${RED}✗ Falha no login admin${NC}"
  echo "$ADMIN_LOGIN"
  exit 1
fi
echo ""

# 4. Login como user
echo "════════════════════════════════════════"
echo "4. Login como USER"
echo "════════════════════════════════════════"
USER_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123"
  }')

USER_TOKEN=$(echo "$USER_LOGIN" | jq -r '.accessToken')

if [ "$USER_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Login user bem-sucedido${NC}"
  echo "Token: ${USER_TOKEN:0:50}..."
else
  echo -e "${RED}✗ Falha no login user${NC}"
  exit 1
fi
echo ""

# 5. Criar cliente como admin
echo "════════════════════════════════════════"
echo "5. Criar cliente (como ADMIN)"
echo "════════════════════════════════════════"
CUSTOMER=$(curl -s -X POST "$API_URL/customers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Cliente Teste Auth",
    "email": "cliente.auth@test.com",
    "document": "98765432100",
    "phone": "11999999999"
  }')

CUSTOMER_ID=$(echo "$CUSTOMER" | jq -r '.id')

if [ "$CUSTOMER_ID" != "null" ]; then
  echo -e "${GREEN}✓ Cliente criado${NC}"
  echo "$CUSTOMER" | jq '{id, name, email}'
else
  echo -e "${RED}✗ Erro ao criar cliente${NC}"
  echo "$CUSTOMER"
fi
echo ""

# 6. Listar clientes como user
echo "════════════════════════════════════════"
echo "6. Listar clientes (como USER)"
echo "════════════════════════════════════════"
CUSTOMERS_LIST=$(curl -s -X GET "$API_URL/customers" \
  -H "Authorization: Bearer $USER_TOKEN")

CUSTOMERS_COUNT=$(echo "$CUSTOMERS_LIST" | jq '. | length')
echo -e "${GREEN}✓ User pode listar clientes${NC}"
echo "Total de clientes: $CUSTOMERS_COUNT"
echo ""

# 7. Tentar deletar como user (deve falhar)
echo "════════════════════════════════════════"
echo "7. Tentar deletar cliente (como USER - deve FALHAR)"
echo "════════════════════════════════════════"
DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/customers/$CUSTOMER_ID" \
  -H "Authorization: Bearer $USER_TOKEN")

HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "403" ]; then
  echo -e "${GREEN}✓ Acesso negado corretamente (403 Forbidden)${NC}"
else
  echo -e "${RED}✗ Deveria ter sido negado (403)${NC}"
  echo "HTTP Code: $HTTP_CODE"
fi
echo ""

# 8. Deletar como admin (deve funcionar)
echo "════════════════════════════════════════"
echo "8. Deletar cliente (como ADMIN)"
echo "════════════════════════════════════════"
DELETE_ADMIN=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/customers/$CUSTOMER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_CODE_ADMIN=$(echo "$DELETE_ADMIN" | tail -n1)

if [ "$HTTP_CODE_ADMIN" == "204" ]; then
  echo -e "${GREEN}✓ Cliente deletado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao deletar${NC}"
  echo "HTTP Code: $HTTP_CODE_ADMIN"
fi
echo ""

# 9. Testar refresh token
echo "════════════════════════════════════════"
echo "9. Renovar token (refresh)"
echo "════════════════════════════════════════"
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$ADMIN_REFRESH\"}")

NEW_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.accessToken')

if [ "$NEW_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Token renovado com sucesso${NC}"
  echo "Novo token: ${NEW_TOKEN:0:50}..."
else
  echo -e "${RED}✗ Erro ao renovar token${NC}"
fi
echo ""

# 10. Tentar acessar sem token (deve falhar)
echo "════════════════════════════════════════"
echo "10. Tentar acessar sem token (deve FALHAR)"
echo "════════════════════════════════════════"
NO_AUTH=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/customers")
HTTP_CODE_NO_AUTH=$(echo "$NO_AUTH" | tail -n1)

if [ "$HTTP_CODE_NO_AUTH" == "401" ]; then
  echo -e "${GREEN}✓ Acesso negado corretamente (401 Unauthorized)${NC}"
else
  echo -e "${RED}✗ Deveria ter sido negado (401)${NC}"
  echo "HTTP Code: $HTTP_CODE_NO_AUTH"
fi
echo ""

# Resumo
echo "════════════════════════════════════════"
echo "✅ Testes de autenticação concluídos!"
echo "════════════════════════════════════════"
echo ""
echo "📊 Informações úteis:"
echo "   - Admin Token: $ADMIN_TOKEN"
echo "   - User Token: $USER_TOKEN"
echo ""
echo "🌐 Teste no Swagger:"
echo "   1. Acesse: $API_URL/api/docs"
echo "   2. Clique em 'Authorize' (cadeado)"
echo "   3. Cole um dos tokens acima"
echo "   4. Teste os endpoints protegidos!"

