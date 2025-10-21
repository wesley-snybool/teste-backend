#!/bin/bash

# Script para iniciar apenas o banco de dados PostgreSQL

echo "🗄️  Iniciando PostgreSQL..."

docker-compose up -d teste-backend-db

echo "✅ PostgreSQL iniciado!"
echo ""
echo "📊 Informações de conexão:"
echo "   Host: localhost"
echo "   Port: 5433"
echo "   Database: postgres"
echo "   User: postgres"
echo "   Password: 1234"
echo ""
echo "💡 Para visualizar os logs: docker-compose logs -f teste-backend-db"
echo "🛑 Para parar: docker-compose down"

