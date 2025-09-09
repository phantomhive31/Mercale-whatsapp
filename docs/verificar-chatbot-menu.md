main.609deb83.js:2 Microphones updated: Array(1)
:8080/public-settings/primaryColorLight:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
:8080/public-settings/appLogoDark:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
:8080/public-settings/appLogoLight:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
:8080/public-settings/appName:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
chatbot-integration:1  Uncaught (in promise) TypeError: Failed to fetch
    at chatbot-integration:1:2859
chatbot-integration:1  Uncaught (in promise) TypeError: Failed to fetch
    at chatbot-integration:1:3111
chatbot-integration:1  Uncaught (in promise) TypeError: Failed to fetch
    at chatbot-integration:1:3489
# ✅ Como Verificar se o Chatbot Está no Menu

## Passos para Verificar

1. **Reinicie o Frontend**
   ```bash
   cd ticketz-main/frontend
   npm start
   ```

2. **Faça Login no Sistema**
   - Acesse o painel administrativo
   - Faça login com suas credenciais

3. **Verifique o Menu Lateral**
   - No menu lateral esquerdo, procure por "Chatbot Inteligente"
   - O item deve aparecer com um ícone de robô (🤖)
   - Deve estar visível para todos os tipos de usuário

4. **Clique no Item do Menu**
   - Clique em "Chatbot Inteligente"
   - Você deve ser redirecionado para `/chatbot`
   - A página de configuração do chatbot deve carregar

## Se o Item Não Aparecer

### 1. Verifique se o Frontend Foi Recompilado
```bash
# No diretório frontend
npm start
```

### 2. Verifique o Console do Browser
- Abra as ferramentas de desenvolvedor (F12)
- Procure por erros no console
- Verifique se há erros de importação

### 3. Verifique se a Rota Está Funcionando
- Acesse manualmente: `http://localhost:3000/chatbot`
- Deve carregar a página de configuração do chatbot

### 4. Verifique se Há Erros de Importação
- Verifique se o ícone `SmartToyIcon` está sendo importado corretamente
- Verifique se a página `Chatbot` existe em `src/pages/Chatbot/`

## Estrutura Esperada no Menu

O menu deve ter esta estrutura:
```
📋 Serviços
├── 💬 Tickets
├── ✅ Tarefas  
├── ⚡ Mensagens Rápidas
├── 📞 Contatos
├── 📅 Horários
├── 🏷️ Tags
├── 💬 Chats
├── ❓ Ajuda
└── 🤖 Chatbot Inteligente  ← ESTE ITEM

⚙️ Administração
├── Dashboard
├── ...
```

## Funcionalidades da Página do Chatbot

Quando acessar `/chatbot`, você deve ver:

1. **Configurações Básicas**
   - Switch para habilitar/desabilitar
   - Mensagens de boas-vindas, fallback e transferência
   - Número máximo de tentativas

2. **Palavras-chave e Respostas**
   - Interface para adicionar palavras-chave
   - Lista de palavras-chave configuradas
   - Opções de confiança e transferência

3. **Teste do Chatbot**
   - Campo para testar mensagens
   - Resultado do teste em tempo real

## Solucionando Problemas Comuns

### Erro: "Cannot resolve module SmartToy"
```bash
# Instale os ícones do Material-UI
npm install @material-ui/icons
```

### Erro: "Cannot find module '../pages/Chatbot'"
- Verifique se o arquivo `src/pages/Chatbot/index.js` existe
- Verifique se a estrutura de pastas está correta

### Erro: "Permission denied"
- O chatbot foi movido para fora das permissões
- Deve funcionar para todos os usuários

## API Endpoints para Teste

Teste se o backend está funcionando:

```bash
# Testar configuração (substitua o token)
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:8080/chatbot/config

# Testar mensagem
curl -X POST \
     -H "Authorization: Bearer SEU_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message":"Olá, preciso de ajuda"}' \
     http://localhost:8080/chatbot/test
```

## Contatos para Suporte

Se ainda tiver problemas:
1. Verifique os logs do console do browser
2. Verifique os logs do backend
3. Entre em contato com o suporte técnico


