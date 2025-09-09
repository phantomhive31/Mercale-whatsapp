import { Request, Response } from "express";
import ChatbotService from "../services/ChatbotService/ChatbotService";
import isAdmin from "../middleware/isAdmin";
import AppError from "../errors/AppError";

interface ChatbotConfigRequest extends Request {
  body: {
    enabled?: boolean;
    welcomeMessage?: string;
    fallbackMessage?: string;
    transferMessage?: string;
    maxAttempts?: number;
    keywords?: {
      [key: string]: {
        response: string;
        confidence: number;
        transferToHuman?: boolean;
      };
    };
  };
  user: {
    id: string;
    profile: string;
    isSuper: boolean;
    companyId: number;
  };
}

export const getChatbotConfig = async (
  req: ChatbotConfigRequest,
  res: Response
): Promise<Response> => {
  try {
    const { companyId } = req.user;

    const chatbotService = ChatbotService.getInstance();
    const config = await chatbotService.getChatbotConfig(companyId);

    return res.json(config);
  } catch (error) {
    console.error("Erro ao obter configuração do chatbot:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateChatbotConfig = async (
  req: ChatbotConfigRequest,
  res: Response
): Promise<Response> => {
  try {
    const { companyId } = req.user;
    const {
      enabled,
      welcomeMessage,
      fallbackMessage,
      transferMessage,
      maxAttempts,
      keywords
    } = req.body;

    // Validações básicas
    if (maxAttempts && (maxAttempts < 1 || maxAttempts > 10)) {
      throw new AppError("Número máximo de tentativas deve estar entre 1 e 10", 400);
    }

    if (welcomeMessage && welcomeMessage.length > 500) {
      throw new AppError("Mensagem de boas-vindas muito longa", 400);
    }

    if (fallbackMessage && fallbackMessage.length > 500) {
      throw new AppError("Mensagem de fallback muito longa", 400);
    }

    if (transferMessage && transferMessage.length > 500) {
      throw new AppError("Mensagem de transferência muito longa", 400);
    }

    const chatbotService = ChatbotService.getInstance();
    await chatbotService.saveChatbotConfig(companyId, {
      enabled,
      welcomeMessage,
      fallbackMessage,
      transferMessage,
      maxAttempts,
      keywords
    });

    return res.json({ message: "Configuração do chatbot atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar configuração do chatbot:", error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const testChatbotResponse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { companyId } = req.user;
    const { message } = req.body;

    if (!message) {
      throw new AppError("Mensagem de teste é obrigatória", 400);
    }

    const chatbotService = ChatbotService.getInstance();
    
    // Criar um ticket mock para teste
    const mockTicket = {
      id: 0,
      companyId,
      contactId: 0,
      whatsappId: 0,
      status: 'pending',
      chatbot: true
    } as any;

    const mockContact = {
      id: 0,
      name: 'Teste',
      number: '5511999999999'
    } as any;

    const response = await chatbotService.analyzeMessage(message, mockTicket, mockContact);

    return res.json({
      message,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao testar resposta do chatbot:", error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getChatbotStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { companyId } = req.user;
    const { startDate, endDate } = req.query;

    // Implementar estatísticas do chatbot
    // Por enquanto, retornar dados mock
    const stats = {
      totalInteractions: 0,
      successfulResponses: 0,
      transfersToHuman: 0,
      averageResponseTime: 0,
      mostCommonKeywords: [],
      period: {
        start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString()
      }
    };

    return res.json(stats);
  } catch (error) {
    console.error("Erro ao obter estatísticas do chatbot:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const resetChatbotConfig = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { companyId } = req.user;

    const chatbotService = ChatbotService.getInstance();
    await chatbotService.saveChatbotConfig(companyId, {
      enabled: false,
      welcomeMessage: 'Olá! Como posso ajudá-lo hoje?',
      fallbackMessage: 'Desculpe, não entendi sua pergunta. Vou transferir você para um de nossos atendentes.',
      transferMessage: 'Transferindo você para um de nossos atendentes. Aguarde um momento.',
      maxAttempts: 3,
      keywords: {}
    });

    return res.json({ message: "Configuração do chatbot resetada para padrão" });
  } catch (error) {
    console.error("Erro ao resetar configuração do chatbot:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

