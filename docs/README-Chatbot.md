# 🤖 Chatbot Inteligente para Primeiro Atendimento

## Visão Geral

O Chatbot Inteligente é uma funcionalidade avançada do Ticketz que automatiza o primeiro atendimento aos clientes, respondendo perguntas comuns automaticamente e transferindo conversas complexas para atendentes humanos quando necessário.

## ✨ Funcionalidades Principais

- **Respostas Automáticas Inteligentes**: Analisa mensagens e responde automaticamente
- **Configuração Flexível**: Interface amigável para configurar respostas e palavras-chave
- **Análise de Intenção**: Identifica automaticamente saudações, perguntas sobre preços, suporte técnico, etc.
- **Transferência Inteligente**: Transfere para atendentes humanos quando necessário
- **Sistema de Confiança**: Pontuação de confiança para determinar quando responder automaticamente
- **Teste Integrado**: Ferramenta de teste para validar configurações
- **Logs Detalhados**: Registra todas as interações para análise

## 🚀 Instalação e Configuração

### 1. Configuração Automática

Execute o script de configuração inicial:

```bash
# Configure as variáveis de ambiente
export API_BASE_URL="http://localhost:8080"
export API_TOKEN="seu-token-de-api"

# Execute o script de configuração
node scripts/setup-chatbot.js
```

### 2. Configuração Manual

1. Acesse o painel administrativo
2. Vá para "Chatbot Inteligente" no menu lateral
3. Configure as mensagens básicas
4. Adicione palavras-chave específicas
5. Teste a configuração

## 📋 Configuração Básica

### Mensagens Padrão

- **Mensagem de Boas-vindas**: Enviada quando o cliente inicia uma conversa
- **Mensagem de Fallback**: Enviada quando o chatbot não entende a pergunta
- **Mensagem de Transferência**: Enviada ao transferir para atendente humano

### Palavras-chave

Configure palavras-chave específicas para seu negócio:

```json
{
  "preço": {
    "response": "Para informações sobre preços, vou transferir você para nosso departamento comercial.",
    "confidence": 0.8,
    "transferToHuman": true
  },
  "suporte": {
    "response": "Vou transferir você para nossa equipe de suporte técnico.",
    "confidence": 0.7,
    "transferToHuman": true
  }
}
```

## 🧠 Análise de Intenção Automática

O sistema identifica automaticamente:

### Saudações
- "olá", "oi", "bom dia", "boa tarde", "boa noite"
- Resposta: Mensagem de boas-vindas configurada

### Agradecimentos
- "obrigado", "obrigada", "valeu", "thanks"
- Resposta: "De nada! Estou aqui para ajudar."

### Despedidas
- "tchau", "até logo", "bye", "goodbye"
- Resposta: "Até logo! Foi um prazer ajudá-lo."

### Perguntas sobre Preços
- "preço", "valor", "custo", "quanto custa"
- Resposta: Transferência para departamento comercial

### Problemas Técnicos
- "problema", "erro", "bug", "não funciona"
- Resposta: Transferência para equipe de suporte

## 🔧 API Endpoints

### GET /chatbot/config
Obtém a configuração atual do chatbot

**Resposta:**
```json
{
  "enabled": true,
  "welcomeMessage": "Olá! Como posso ajudá-lo?",
  "fallbackMessage": "Desculpe, não entendi...",
  "transferMessage": "Transferindo para atendente...",
  "maxAttempts": 3,
  "keywords": { ... }
}
```

### PUT /chatbot/config
Atualiza a configuração do chatbot

**Requisição:**
```json
{
  "enabled": true,
  "welcomeMessage": "Nova mensagem de boas-vindas",
  "fallbackMessage": "Nova mensagem de fallback",
  "transferMessage": "Nova mensagem de transferência",
  "maxAttempts": 5,
  "keywords": {
    "palavra-chave": {
      "response": "Resposta personalizada",
      "confidence": 0.8,
      "transferToHuman": true
    }
  }
}
```

### POST /chatbot/test
Testa uma mensagem com o chatbot

**Requisição:**
```json
{
  "message": "Qual o preço do produto?"
}
```

**Resposta:**
```json
{
  "message": "Qual o preço do produto?",
  "response": {
    "shouldRespond": true,
    "response": "Para informações sobre preços...",
    "confidence": 0.8,
    "transferToHuman": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### POST /chatbot/reset
Reseta a configuração para os valores padrão

### GET /chatbot/stats
Obtém estatísticas do chatbot

## 📊 Monitoramento

O sistema registra:
- Todas as mensagens analisadas pelo chatbot
- Respostas enviadas automaticamente
- Transferências para atendentes humanos
- Tentativas de resposta por ticket

## 🎯 Melhores Práticas

### 1. Configuração de Palavras-chave
- Use termos específicos do seu negócio
- Configure níveis de confiança apropriados
- Teste com mensagens reais de clientes

### 2. Mensagens
- Mantenha mensagens claras e úteis
- Use tom amigável e profissional
- Inclua informações relevantes

### 3. Transferências
- Configure transferências para casos complexos
- Monitore padrões de transferência
- Ajuste limites de tentativas conforme necessário

### 4. Testes
- Teste regularmente com diferentes tipos de mensagens
- Monitore o desempenho do chatbot
- Ajuste configurações baseado nos resultados

## 🔍 Troubleshooting

### Chatbot não responde
1. Verifique se está habilitado nas configurações
2. Confirme se o ticket está com `chatbot: true`
3. Verifique os logs para erros

### Respostas inadequadas
1. Ajuste o nível de confiança das palavras-chave
2. Adicione mais palavras-chave específicas
3. Revise as mensagens de fallback

### Transferências excessivas
1. Aumente o número máximo de tentativas
2. Adicione mais palavras-chave com `transferToHuman: false`
3. Ajuste os níveis de confiança

## 📚 Exemplos de Uso

### E-commerce
```json
{
  "keywords": {
    "preço": {
      "response": "Para informações sobre preços e promoções, vou transferir você para nosso departamento comercial.",
      "confidence": 0.8,
      "transferToHuman": true
    },
    "entrega": {
      "response": "Para informações sobre prazo de entrega e frete, vou transferir você para nosso departamento de logística.",
      "confidence": 0.8,
      "transferToHuman": true
    }
  }
}
```

### Suporte Técnico
```json
{
  "keywords": {
    "problema": {
      "response": "Entendo que você está com um problema. Vou transferir você para nossa equipe de suporte técnico.",
      "confidence": 0.7,
      "transferToHuman": true
    },
    "erro": {
      "response": "Para resolver este erro, vou transferir você para nossa equipe técnica especializada.",
      "confidence": 0.7,
      "transferToHuman": true
    }
  }
}
```

### Atendimento Geral
```json
{
  "keywords": {
    "horário": {
      "response": "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.",
      "confidence": 0.9,
      "transferToHuman": false
    },
    "contato": {
      "response": "Você pode nos contatar pelo WhatsApp, telefone (11) 99999-9999, ou email contato@empresa.com.br.",
      "confidence": 0.8,
      "transferToHuman": false
    }
  }
}
```

## 🤝 Suporte

Para dúvidas ou problemas com o chatbot:

1. Consulte os logs do sistema para erros específicos
2. Use a ferramenta de teste integrada
3. Verifique a documentação da API
4. Entre em contato com o suporte técnico

## 📈 Roadmap

Funcionalidades planejadas para futuras versões:

- [ ] Integração com IA externa (OpenAI, Google AI)
- [ ] Análise de sentimento das mensagens
- [ ] Respostas baseadas em contexto da conversa
- [ ] Integração com base de conhecimento
- [ ] Métricas avançadas de desempenho
- [ ] Suporte a múltiplos idiomas
- [ ] Respostas com mídia (imagens, documentos)

---

**Desenvolvido com ❤️ para o Ticketz**

