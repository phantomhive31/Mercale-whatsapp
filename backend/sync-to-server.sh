#!/bin/bash

# Script para sincronizar alterações para o servidor
echo "Sincronizando alterações para o servidor..."

# Copiar arquivos alterados para o servidor
scp src/app.ts root@srv-bot-28:/home/suporte/Mercale-whatsapp/backend/src/
scp src/generated/translationKeys.ts root@srv-bot-28:/home/suporte/Mercale-whatsapp/backend/src/generated/

# Recompilar no servidor
ssh root@srv-bot-28 "cd /home/suporte/Mercale-whatsapp/backend && npm run build"

echo "Sincronização concluída!"
