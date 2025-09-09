import AppError from "../../errors/AppError";
import CheckContactOpenTickets from "../../helpers/CheckContactOpenTickets";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import Ticket from "../../models/Ticket";
import ShowContactService from "../ContactServices/ShowContactService";
import { getIO } from "../../libs/socket";
import FindOrCreateATicketTrakingService from "./FindOrCreateATicketTrakingService";
import Contact from "../../models/Contact";
import { incrementCounter } from "../CounterServices/IncrementCounter";
import { WebhookService } from "../webhookService";
import { OptinService } from "../OptinService";

interface Request {
  contactId: number;
  userId: number;
  companyId: number;
  queueId?: number;
}

const CreateTicketService = async ({
  contactId,
  userId,
  queueId,
  companyId
}: Request): Promise<Ticket> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(companyId);

  await CheckContactOpenTickets(contactId, defaultWhatsapp.id);

  const { isGroup } = await ShowContactService(contactId, companyId);

  const ticket = await Ticket.create({
    contactId,
    companyId,
    queueId,
    whatsappId: defaultWhatsapp.id,
    status: "open",
    isGroup,
    userId
  });

  if (!ticket) {
    throw new AppError("ERR_CREATING_TICKET");
  }

  await FindOrCreateATicketTrakingService({
    ticketId: ticket.id,
    companyId: ticket.companyId,
    whatsappId: ticket.whatsappId,
    userId: ticket.userId
  });

  incrementCounter(ticket.companyId, "ticket-create");

  await ticket.reload({
    include: [
      {
        model: Contact,
        as: "contact",
        include: ["tags", "extraInfo"]
      },
      "queue",
      "whatsapp",
      "user",
      "tags"
    ]
  });

  const io = getIO();

  io.to(ticket.id.toString()).emit("ticket", {
    action: "update",
    ticket
  });

  // Enviar webhook para n8n
  try {
    await WebhookService.getInstance().ticketCreated(ticket);
  } catch (error) {
    console.error('Error sending webhook for ticket creation:', error);
  }

  // DESATIVADO TEMPORARIAMENTE - Enviar mensagem de opt-in se for o primeiro contato e ainda não foi enviada
  // try {
  //   console.log('=== OPT-IN DEBUG ===');
  //   console.log('Ticket contact:', ticket.contact ? 'exists' : 'null');
  //   if (ticket.contact) {
  //     console.log('Contact optinMessageSent:', ticket.contact.optinMessageSent);
  //     console.log('Contact ID:', ticket.contact.id);
  //     console.log('Contact name:', ticket.contact.name);
  //   }
  //   
  //   const contact = ticket.contact;
  //   if (contact && !contact.optinMessageSent) {
  //     console.log('Sending opt-in message for contact:', contact.id);
  //     await OptinService.getInstance().sendOptinMessage(contact, ticket);
  //   } else {
  //     console.log('Opt-in message not sent - conditions not met');
  //   }
  //   console.log('=== END OPT-IN DEBUG ===');
  // } catch (error) {
  //   console.error('Error sending opt-in message:', error);
  // }

  return ticket;
};

export default CreateTicketService;
