#!/bin/bash

# Script para iniciar toda a aplicação (banco + API)

echo "🚀 Iniciando Sistema de Pagamentos..."
echo ""

# Para containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Constrói as imagens
echo "🔨 Construindo imagens..."
docker-compose build

# Inicia os serviços
echo "▶️  Iniciando serviços..."
docker-compose up -d

# Aguarda os serviços ficarem prontos
echo ""
echo "⏳ Aguardando serviços iniciarem..."
sleep 5

# Verifica o status
echo ""
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo ""
echo "🌐 Acesse:"
echo "   - API: http://localhost:3000"
echo "   - Swagger: http://localhost:3000/api/docs"
echo "   - Health Check: http://localhost:3000"
echo ""
echo "📊 Banco de dados:"
echo "   - Host: localhost"
echo "   - Port: 5433"
echo "   - Database: postgres"
echo "   - User: postgres"
echo "   - Password: 1234"
echo ""
echo "💡 Comandos úteis:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Ver logs da API: docker-compose logs -f teste-backend-app"
echo "   - Ver logs do DB: docker-compose logs -f teste-backend-db"
echo "   - Parar: docker-compose down"
echo "   - Reiniciar: docker-compose restart"

