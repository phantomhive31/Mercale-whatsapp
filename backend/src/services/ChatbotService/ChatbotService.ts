import { Op } from "sequelize";
import Ticket from "../../models/Ticket";
import Contact from "../../models/Contact";
import Message from "../../models/Message";
import Setting from "../../models/Setting";
import Company from "../../models/Company";
import { SendWhatsAppMessage } from "../WbotServices/SendWhatsAppMessage";
import { formatBody } from "../../helpers/Mustache";

interface ChatbotResponse {
  shouldRespond: boolean;
  response?: string;
  transferToHuman?: boolean;
  confidence?: number;
}

interface ChatbotConfig {
  enabled: boolean;
  welcomeMessage: string;
  fallbackMessage: string;
  transferMessage: string;
  maxAttempts: number;
  keywords: {
    [key: string]: {
      response: string;
      confidence: number;
      transferToHuman?: boolean;
    };
  };
}

export class ChatbotService {
  private static instance: ChatbotService;

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  /**
   * Analisa a mensagem do usuário e determina se deve responder automaticamente
   */
  public async analyzeMessage(
    message: string,
    ticket: Ticket,
    contact: Contact
  ): Promise<ChatbotResponse> {
    try {
      // Verificar se o chatbot está habilitado para esta empresa
      const config = await this.getChatbotConfig(ticket.companyId);
      if (!config.enabled) {
        return { shouldRespond: false };
      }

      // Verificar se já excedeu o número máximo de tentativas
      const attempts = await this.getChatbotAttempts(ticket.id);
      if (attempts >= config.maxAttempts) {
        return {
          shouldRespond: true,
          response: config.transferMessage,
          transferToHuman: true
        };
      }

      // Normalizar mensagem para análise
      const normalizedMessage = this.normalizeMessage(message);
      
      // Buscar resposta baseada em palavras-chave
      const keywordResponse = this.findKeywordResponse(normalizedMessage, config);
      if (keywordResponse) {
        return {
          shouldRespond: true,
          response: keywordResponse.response,
          transferToHuman: keywordResponse.transferToHuman,
          confidence: keywordResponse.confidence
        };
      }

      // Análise de intenção usando padrões comuns
      const intentResponse = this.analyzeIntent(normalizedMessage, config);
      if (intentResponse) {
        return {
          shouldRespond: true,
          response: intentResponse.response,
          transferToHuman: intentResponse.transferToHuman,
          confidence: intentResponse.confidence
        };
      }

      // Se não encontrou resposta adequada, usar mensagem de fallback
      return {
        shouldRespond: true,
        response: config.fallbackMessage,
        confidence: 0.3
      };

    } catch (error) {
      console.error('Erro ao analisar mensagem do chatbot:', error);
      return { shouldRespond: false };
    }
  }

  /**
   * Processa a resposta do chatbot
   */
  public async processResponse(
    response: ChatbotResponse,
    ticket: Ticket,
    contact: Contact
  ): Promise<void> {
    if (!response.shouldRespond || !response.response) {
      return;
    }

    try {
      // Incrementar contador de tentativas
      await this.incrementChatbotAttempts(ticket.id);

      // Enviar resposta formatada
      const formattedResponse = formatBody(response.response, ticket);
      await SendWhatsAppMessage({
        body: formattedResponse,
        ticket,
        userId: 1 // Sistema
      });

      // Se deve transferir para humano, atualizar status do ticket
      if (response.transferToHuman) {
        await ticket.update({
          chatbot: false,
          status: 'pending'
        });
      }

    } catch (error) {
      console.error('Erro ao processar resposta do chatbot:', error);
    }
  }

  /**
   * Obtém configuração do chatbot para a empresa
   */
  private async getChatbotConfig(companyId: number): Promise<ChatbotConfig> {
    const settings = await Setting.findAll({
      where: {
        companyId,
        key: {
          [Op.in]: [
            'chatbotEnabled',
            'chatbotWelcomeMessage',
            'chatbotFallbackMessage',
            'chatbotTransferMessage',
            'chatbotMaxAttempts',
            'chatbotKeywords'
          ]
        }
      }
    });

    const configMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as { [key: string]: string });

    return {
      enabled: configMap.chatbotEnabled === 'enabled',
      welcomeMessage: configMap.chatbotWelcomeMessage || 'Olá! Como posso ajudá-lo hoje?',
      fallbackMessage: configMap.chatbotFallbackMessage || 'Desculpe, não entendi sua pergunta. Vou transferir você para um de nossos atendentes.',
      transferMessage: configMap.chatbotTransferMessage || 'Transferindo você para um de nossos atendentes. Aguarde um momento.',
      maxAttempts: parseInt(configMap.chatbotMaxAttempts || '3', 10),
      keywords: this.parseKeywords(configMap.chatbotKeywords || '{}')
    };
  }

  /**
   * Normaliza mensagem para análise
   */
  private normalizeMessage(message: string): string {
    return message
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .replace(/\s+/g, ' '); // Remove espaços extras
  }

  /**
   * Busca resposta baseada em palavras-chave
   */
  private findKeywordResponse(
    message: string,
    config: ChatbotConfig
  ): { response: string; confidence: number; transferToHuman?: boolean } | null {
    for (const [keyword, config] of Object.entries(config.keywords)) {
      if (message.includes(keyword.toLowerCase())) {
        return {
          response: config.response,
          confidence: config.confidence,
          transferToHuman: config.transferToHuman
        };
      }
    }
    return null;
  }

  /**
   * Analisa intenção da mensagem usando padrões comuns
   */
  private analyzeIntent(
    message: string,
    config: ChatbotConfig
  ): { response: string; confidence: number; transferToHuman?: boolean } | null {
    // Padrões de saudação
    if (this.matchesPattern(message, ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'])) {
      return {
        response: config.welcomeMessage,
        confidence: 0.9
      };
    }

    // Padrões de agradecimento
    if (this.matchesPattern(message, ['obrigado', 'obrigada', 'valeu', 'thanks', 'thank you'])) {
      return {
        response: 'De nada! Estou aqui para ajudar. Precisa de mais alguma coisa?',
        confidence: 0.8
      };
    }

    // Padrões de despedida
    if (this.matchesPattern(message, ['tchau', 'até logo', 'bye', 'goodbye', 'falou'])) {
      return {
        response: 'Até logo! Foi um prazer ajudá-lo. Volte sempre!',
        confidence: 0.8
      };
    }

    // Padrões de preços
    if (this.matchesPattern(message, ['preço', 'valor', 'custo', 'quanto custa', 'price', 'cost'])) {
      return {
        response: 'Para informações sobre preços, vou transferir você para nosso departamento comercial.',
        confidence: 0.7,
        transferToHuman: true
      };
    }

    // Padrões de suporte técnico
    if (this.matchesPattern(message, ['problema', 'erro', 'bug', 'não funciona', 'issue', 'problem'])) {
      return {
        response: 'Entendo que você está com um problema técnico. Vou transferir você para nossa equipe de suporte.',
        confidence: 0.7,
        transferToHuman: true
      };
    }

    return null;
  }

  /**
   * Verifica se a mensagem contém algum dos padrões
   */
  private matchesPattern(message: string, patterns: string[]): boolean {
    return patterns.some(pattern => message.includes(pattern));
  }

  /**
   * Parse das palavras-chave do JSON
   */
  private parseKeywords(keywordsJson: string): { [key: string]: any } {
    try {
      return JSON.parse(keywordsJson);
    } catch {
      return {};
    }
  }

  /**
   * Obtém número de tentativas do chatbot para o ticket
   */
  private async getChatbotAttempts(ticketId: number): Promise<number> {
    const attempts = await Message.count({
      where: {
        ticketId,
        fromMe: true,
        body: {
          [Op.like]: '%[Chatbot]%'
        }
      }
    });
    return attempts;
  }

  /**
   * Incrementa contador de tentativas do chatbot
   */
  private async incrementChatbotAttempts(ticketId: number): Promise<void> {
    // Esta informação pode ser armazenada em uma tabela específica ou como metadado
    // Por simplicidade, vamos usar o contador de mensagens do sistema
    await Message.create({
      ticketId,
      body: '[Chatbot] Attempt logged',
      fromMe: true,
      read: true,
      mediaType: 'text'
    });
  }

  /**
   * Salva configuração do chatbot
   */
  public async saveChatbotConfig(
    companyId: number,
    config: Partial<ChatbotConfig>
  ): Promise<void> {
    const settings = [];

    if (config.enabled !== undefined) {
      settings.push({
        key: 'chatbotEnabled',
        value: config.enabled ? 'enabled' : 'disabled',
        companyId
      });
    }

    if (config.welcomeMessage) {
      settings.push({
        key: 'chatbotWelcomeMessage',
        value: config.welcomeMessage,
        companyId
      });
    }

    if (config.fallbackMessage) {
      settings.push({
        key: 'chatbotFallbackMessage',
        value: config.fallbackMessage,
        companyId
      });
    }

    if (config.transferMessage) {
      settings.push({
        key: 'chatbotTransferMessage',
        value: config.transferMessage,
        companyId
      });
    }

    if (config.maxAttempts) {
      settings.push({
        key: 'chatbotMaxAttempts',
        value: config.maxAttempts.toString(),
        companyId
      });
    }

    if (config.keywords) {
      settings.push({
        key: 'chatbotKeywords',
        value: JSON.stringify(config.keywords),
        companyId
      });
    }

    // Salvar ou atualizar configurações
    for (const setting of settings) {
      await Setting.upsert(setting);
    }
  }
}

export default ChatbotService;

