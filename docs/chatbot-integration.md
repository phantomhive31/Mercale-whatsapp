# Chatbot Inteligente para Primeiro Atendimento

## Visão Geral

O sistema de chatbot inteligente foi implementado para automatizar o primeiro atendimento aos clientes, respondendo perguntas comuns automaticamente e transferindo conversas complexas para atendentes humanos quando necessário.

## Funcionalidades

### 1. Respostas Automáticas Inteligentes
- **Análise de Intenção**: O chatbot analisa a mensagem do cliente e identifica a intenção (saudação, pergunta sobre preços, suporte técnico, etc.)
- **Palavras-chave Configuráveis**: Administradores podem configurar palavras-chave específicas com respostas personalizadas
- **Confiança Adaptativa**: Sistema de pontuação de confiança para determinar quando responder automaticamente ou transferir para humano

### 2. Configuração Flexível
- **Mensagens Personalizáveis**: 
  - Mensagem de boas-vindas
  - Mensagem de fallback (quando não entende)
  - Mensagem de transferência para atendente
- **Limite de Tentativas**: Configuração do número máximo de tentativas antes de transferir
- **Palavras-chave**: Sistema de palavras-chave com respostas específicas

### 3. Integração com Sistema Existente
- **Compatibilidade com Filas**: Funciona com o sistema de filas existente
- **Transferência Inteligente**: Transfere automaticamente para atendentes quando necessário
- **Logs Detalhados**: Registra todas as interações para análise

## Como Usar

### 1. Configuração Inicial

1. Acesse o menu lateral e clique em "Chatbot Inteligente"
2. Ative o chatbot marcando a opção "Habilitar Chatbot"
3. Configure as mensagens básicas:
   - **Mensagem de Boas-vindas**: Enviada quando o cliente inicia uma conversa
   - **Mensagem de Fallback**: Enviada quando o chatbot não entende a pergunta
   - **Mensagem de Transferência**: Enviada ao transferir para atendente humano

### 2. Configuração de Palavras-chave

1. Na seção "Palavras-chave e Respostas", adicione palavras-chave específicas
2. Para cada palavra-chave, configure:
   - **Palavra-chave**: Termo que o cliente pode usar (ex: "preço", "valor", "custo")
   - **Resposta**: Resposta automática personalizada
   - **Confiança**: Nível de confiança (50% a 90%)
   - **Transferir para humano**: Se deve transferir após esta resposta

### 3. Teste do Sistema

1. Use a seção "Teste do Chatbot" para testar diferentes mensagens
2. O sistema mostrará:
   - Se deve responder automaticamente
   - Qual resposta será enviada
   - Nível de confiança da resposta
   - Se transferirá para atendente humano

## Exemplos de Configuração

### Palavras-chave Comuns

```json
{
  "preço": {
    "response": "Para informações sobre preços, vou transferir você para nosso departamento comercial.",
    "confidence": 0.8,
    "transferToHuman": true
  },
  "suporte": {
    "response": "Entendo que você precisa de suporte técnico. Vou transferir você para nossa equipe especializada.",
    "confidence": 0.7,
    "transferToHuman": true
  },
  "horário": {
    "response": "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.",
    "confidence": 0.9,
    "transferToHuman": false
  }
}
```

### Mensagens Padrão

- **Boas-vindas**: "Olá! Como posso ajudá-lo hoje?"
- **Fallback**: "Desculpe, não entendi sua pergunta. Vou transferir você para um de nossos atendentes."
- **Transferência**: "Transferindo você para um de nossos atendentes. Aguarde um momento."

## Análise de Intenção Automática

O sistema identifica automaticamente:

### Saudações
- "olá", "oi", "bom dia", "boa tarde", "boa noite"
- Resposta: Mensagem de boas-vindas configurada

### Agradecimentos
- "obrigado", "obrigada", "valeu", "thanks"
- Resposta: "De nada! Estou aqui para ajudar. Precisa de mais alguma coisa?"

### Despedidas
- "tchau", "até logo", "bye", "goodbye"
- Resposta: "Até logo! Foi um prazer ajudá-lo. Volte sempre!"

### Perguntas sobre Preços
- "preço", "valor", "custo", "quanto custa"
- Resposta: Transferência para departamento comercial

### Problemas Técnicos
- "problema", "erro", "bug", "não funciona"
- Resposta: Transferência para equipe de suporte

## API Endpoints

### GET /chatbot/config
Obtém a configuração atual do chatbot

### PUT /chatbot/config
Atualiza a configuração do chatbot

```json
{
  "enabled": true,
  "welcomeMessage": "Olá! Como posso ajudá-lo?",
  "fallbackMessage": "Desculpe, não entendi...",
  "transferMessage": "Transferindo para atendente...",
  "maxAttempts": 3,
  "keywords": {
    "preço": {
      "response": "Resposta sobre preços",
      "confidence": 0.8,
      "transferToHuman": true
    }
  }
}
```

### POST /chatbot/test
Testa uma mensagem com o chatbot

```json
{
  "message": "Qual o preço do produto?"
}
```

### POST /chatbot/reset
Reseta a configuração para os valores padrão

## Monitoramento e Logs

O sistema registra:
- Todas as mensagens analisadas pelo chatbot
- Respostas enviadas automaticamente
- Transferências para atendentes humanos
- Tentativas de resposta por ticket

## Melhores Práticas

1. **Configure palavras-chave específicas** para seu negócio
2. **Teste regularmente** com mensagens reais de clientes
3. **Monitore as transferências** para identificar padrões
4. **Ajuste a confiança** baseado no desempenho
5. **Mantenha mensagens claras e úteis**
6. **Configure limites de tentativas** apropriados

## Troubleshooting

### Chatbot não responde
- Verifique se está habilitado nas configurações
- Confirme se o ticket está com `chatbot: true`
- Verifique os logs para erros

### Respostas inadequadas
- Ajuste o nível de confiança das palavras-chave
- Adicione mais palavras-chave específicas
- Revise as mensagens de fallback

### Transferências excessivas
- Aumente o número máximo de tentativas
- Adicione mais palavras-chave com `transferToHuman: false`
- Ajuste os níveis de confiança

## Suporte

Para dúvidas ou problemas com o chatbot, consulte:
- Logs do sistema para erros específicos
- Documentação da API
- Suporte técnico da equipe de desenvolvimento

