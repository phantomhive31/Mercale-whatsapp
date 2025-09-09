#!/bin/bash
# Script para recompilar o servidor

echo "🔄 Recompilando o servidor..."

# Navegar para o diretório do backend
cd /home/suporte/Mercale-whatsapp/backend

# Fazer pull das mudanças
echo "📥 Fazendo pull das mudanças..."
git pull origin main

# Recompilar
echo "🔨 Recompilando TypeScript..."
npm run build

# Verificar se compilou com sucesso
if [ $? -eq 0 ]; then
    echo "✅ Compilação bem-sucedida!"
    echo "🚀 Iniciando servidor..."
    npm start
else
    echo "❌ Erro na compilação!"
    exit 1
fi
