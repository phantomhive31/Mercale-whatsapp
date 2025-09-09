# Integração Ticketz com n8n

## Visão Geral

Esta integração permite que o Ticketz envie webhooks para o n8n e que o n8n acesse dados e execute ações no Ticketz via API.

## Configuração

### Variáveis de Ambiente

No arquivo `.env-backend-local`:

```bash
# N8N Integration
N8N_ENABLED=true
N8N_BASE_URL=http://n8n:5678
N8N_WEBHOOK_URL=http://n8n:5678/webhook/ticketz
INTEGRATION_TOKEN=ticketz-integration-2024
```

### Acesso ao n8n

- **URL**: http://localhost:5678
- **Usuário**: admin
- **Senha**: admin123

## Webhooks (Ticketz → n8n)

O Ticketz envia automaticamente webhooks para o n8n nos seguintes eventos:

### Eventos Disponíveis

1. **ticket.created** - Quando um ticket é criado
2. **ticket.updated** - Quando um ticket é atualizado
3. **message.received** - Quando uma mensagem é recebida
4. **contact.created** - Quando um contato é criado
5. **user.logged_in** - Quando um usuário faz login

### Formato do Webhook

```json
{
  "event": "ticket.created",
  "data": {
    "id": 1,
    "status": "open",
    "contactId": 1,
    "userId": 1,
    "lastMessage": "Olá, preciso de ajuda"
  },
  "timestamp": "2025-08-30T18:49:28.064Z",
  "source": "ticketz"
}
```

### Configuração no n8n

1. Crie um novo workflow
2. Adicione um nó "Webhook"
3. Configure a URL: `http://localhost:5678/webhook/ticketz`
4. Use o nó "Switch" para filtrar por tipo de evento
5. Processe os dados conforme necessário

## API (n8n → Ticketz)

### Autenticação

Use o header: `x-integration-token: ticketz-integration-2024`

### Endpoints Disponíveis

#### 1. Criar Ticket
```
POST /backend/integrations/tickets
Content-Type: application/json
x-integration-token: ticketz-integration-2024

{
  "contactId": 1,
  "message": "Ticket criado via n8n",
  "status": "open",
  "userId": 1
}
```

#### 2. Enviar Mensagem
```
POST /backend/integrations/messages
Content-Type: application/json
x-integration-token: ticketz-integration-2024

{
  "ticketId": 1,
  "body": "Mensagem enviada via n8n",
  "fromMe": false
}
```

#### 3. Buscar Ticket
```
GET /backend/integrations/tickets/{id}
x-integration-token: ticketz-integration-2024
```

#### 4. Atualizar Status do Ticket
```
PATCH /backend/integrations/tickets/{id}/status
Content-Type: application/json
x-integration-token: ticketz-integration-2024

{
  "status": "closed"
}
```

## Exemplos de Uso

### 1. Notificação Automática no Slack

Quando um ticket é criado:
1. n8n recebe webhook `ticket.created`
2. Filtra por prioridade/status
3. Envia mensagem para canal Slack
4. Atualiza status do ticket via API

### 2. Integração com CRM

Quando uma mensagem é recebida:
1. n8n recebe webhook `message.received`
2. Busca informações do contato
3. Cria/atualiza registro no CRM
4. Responde automaticamente se necessário

### 3. Relatórios Automáticos

Diariamente às 9h:
1. n8n busca tickets via API
2. Gera relatório de performance
3. Envia por email
4. Atualiza dashboard

## Troubleshooting

### Webhooks não chegando
- Verifique se `N8N_ENABLED=true`
- Confirme se a URL do webhook está correta
- Verifique logs do backend

### Erro 401 (Unauthorized)
- Verifique se o token está correto
- Confirme se o header `x-integration-token` está sendo enviado

### Erro 404 (Not Found)
- Verifique se as rotas estão sendo carregadas
- Confirme se o backend está rodando

## Logs

Os webhooks são logados no console do backend. Procure por:
- "Webhook sent successfully for event: {event}"
- "Failed to send webhook for event: {event}"

## Segurança

- O token de integração deve ser mantido em segredo
- Considere usar HTTPS em produção
- Monitore o uso das APIs de integração
