#!/bin/bash

echo "🚀 Iniciando deploy para produção com HTTPS..."

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Remover containers antigos
echo "🧹 Limpando containers antigos..."
docker system prune -f

# Construir novas imagens
echo "🔨 Construindo imagens..."
docker-compose -f docker-compose-prod.yaml build --no-cache

# Subir containers com SSL
echo "🚀 Subindo containers com SSL..."
docker-compose -f docker-compose-prod.yaml up -d

# Aguardar containers subirem
echo "⏳ Aguardando containers subirem..."
sleep 30

# Verificar status
echo "📊 Verificando status dos containers..."
docker-compose -f docker-compose-prod.yaml ps

# Verificar logs
echo "📋 Verificando logs..."
docker-compose -f docker-compose-prod.yaml logs --tail=20

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://whatsapp.mercteste.live"
echo "📊 Monitor: docker-compose -f docker-compose-prod.yaml logs -f"
