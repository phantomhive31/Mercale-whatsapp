import { checkCompanyCompliant } from "../../helpers/CheckCompanyCompliant";
import { getIO } from "../../libs/socket";
import Contact from "../../models/Contact";
import Message from "../../models/Message";
import OldMessage from "../../models/OldMessage";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import { WebhookService } from "../webhookService";
import { OptinService } from "../OptinService";
import { AIService } from "../AIService";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import ChatbotService from "../ChatbotService/ChatbotService";

interface MessageData {
  id: string;
  ticketId: number;
  body: string;
  contactId?: number;
  fromMe?: boolean;
  read?: boolean;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  ack?: number;
  queueId?: number;
  channel?: string;
}
interface Request {
  messageData: MessageData;
  companyId: number;
}

const CreateMessageService = async ({
  messageData,
  companyId
}: Request): Promise<Message> => {
  await Message.upsert({ ...messageData, companyId });

  const message = await Message.findOne({
    where: {
      id: messageData.id,
      ticketId: messageData.ticketId
    },
    include: [
      "contact",
      {
        model: Ticket,
        as: "ticket",
        include: [
          {
            model: Contact,
            as: "contact",
            include: ["tags", "extraInfo"]
          },
          "queue",
          "tags",
          "user",
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["name", "id"]
          }
        ]
      },
      {
        model: Message,
        as: "quotedMsg",
        include: ["contact"],
        where: {
          companyId
        },
        required: false
      },
      {
        model: OldMessage,
        as: "oldMessages",
        where: {
          ticketId: messageData.ticketId
        },
        required: false
      }
    ]
  });

  await message.ticket.contact.update({ presence: "available" });
  await message.ticket.contact.reload();

  if (message.ticket.queueId !== null && message.queueId === null) {
    await message.update({ queueId: message.ticket.queueId });
  }

  if (!message) {
    throw new Error("ERR_CREATING_MESSAGE");
  }

  if (!(await checkCompanyCompliant(companyId))) {
    return message;
  }

  const io = getIO();
  io.to(message.ticketId.toString())
    .to(`company-${companyId}-${message.ticket.status}`)
    .to(`company-${companyId}-notification`)
    .to(`queue-${message.ticket.queueId}-${message.ticket.status}`)
    .to(`queue-${message.ticket.queueId}-notification`)
    .emit(`company-${companyId}-appMessage`, {
      action: "create",
      message,
      ticket: message.ticket,
      contact: message.ticket.contact
    });

  io.to(`company-${companyId}-mainchannel`).emit(
    `company-${companyId}-contact`,
    {
      action: "update",
      contact: message.ticket.contact
    }
  );
  logger.debug(
    {
      company: companyId,
      ticket: message.ticketId,
      queue: message.ticket.queueId,
      status: message.ticket.status
    },
    "sending appMessage event"
  );

  // Enviar webhook para n8n
  try {
    await WebhookService.getInstance().messageReceived(message);
  } catch (error) {
    console.error('Error sending webhook for message creation:', error);
  }

  // Processar resposta de opt-in se for uma mensagem do cliente
  if (!message.fromMe && message.ticket?.contact) {
    try {
      await OptinService.getInstance().processOptinResponse(
        message.ticket.contact,
        message.body
      );
    } catch (error) {
      console.error('Error processing opt-in response:', error);
    }
  }

  // IA: Analisar mensagem para perguntas sobre preços/produtos
  if (!message.fromMe && message.ticket) {
    try {
      console.log('=== AI ANALYSIS DEBUG ===');
      console.log('Analyzing message:', message.body);
      
      const aiAnalysis = await AIService.getInstance().analyzeMessage(
        message.body,
        message.ticket.companyId
      );
      
      console.log('AI Analysis result:', {
        isPriceQuestion: aiAnalysis.isPriceQuestion,
        confidence: aiAnalysis.confidence,
        detectedProduct: aiAnalysis.detectedProduct
      });

      // Se for uma pergunta sobre preço com alta confiança, responder automaticamente
      if (await AIService.getInstance().shouldAutoRespond(aiAnalysis, message.ticket.companyId) && aiAnalysis.suggestedResponse) {
        console.log('Auto-responding with AI suggestion');
        
        await SendWhatsAppMessage({
          body: aiAnalysis.suggestedResponse,
          ticket: message.ticket,
          userId: 1 // admin
        });

        console.log('AI auto-response sent successfully');
      }
      
      console.log('=== END AI ANALYSIS DEBUG ===');
    } catch (error) {
      console.error('Error in AI analysis:', error);
    }
  }

  // Chatbot: Análise inteligente para primeiro atendimento
  if (!message.fromMe && message.ticket && message.ticket.chatbot) {
    try {
      console.log('=== CHATBOT ANALYSIS DEBUG ===');
      console.log('Analyzing message for chatbot:', message.body);
      
      const chatbotService = ChatbotService.getInstance();
      const chatbotResponse = await chatbotService.analyzeMessage(
        message.body,
        message.ticket,
        message.ticket.contact
      );
      
      console.log('Chatbot Analysis result:', {
        shouldRespond: chatbotResponse.shouldRespond,
        confidence: chatbotResponse.confidence,
        transferToHuman: chatbotResponse.transferToHuman
      });

      if (chatbotResponse.shouldRespond) {
        console.log('Processing chatbot response');
        await chatbotService.processResponse(
          chatbotResponse,
          message.ticket,
          message.ticket.contact
        );
        console.log('Chatbot response processed successfully');
      }
      
      console.log('=== END CHATBOT ANALYSIS DEBUG ===');
    } catch (error) {
      console.error('Error in chatbot analysis:', error);
    }
  }

  return message;
};

export default CreateMessageService;
