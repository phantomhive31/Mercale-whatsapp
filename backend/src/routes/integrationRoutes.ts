import { Router } from 'express';
import isAuth from '../middleware/isAuth';
import Ticket from '../models/Ticket';
import Contact from '../models/Contact';
import Message from '../models/Message';
import User from '../models/User';

const router = Router();

// Middleware para autenticação via token de integração
const validateIntegrationToken = (req: any, res: any, next: any) => {
  const token = req.headers['x-integration-token'];
  const expectedToken = process.env.INTEGRATION_TOKEN || 'ticketz-integration-2024';
  
  if (!token || token !== expectedToken) {
    return res.status(401).json({ error: 'Invalid integration token' });
  }
  
  next();
};

// Rota para o n8n criar tickets
router.post('/tickets', validateIntegrationToken, async (req, res) => {
  try {
    const { contactId, message, status, userId } = req.body;
    
    if (!contactId || !message) {
      return res.status(400).json({ error: 'contactId and message are required' });
    }

    const ticket = await Ticket.create({
      contactId,
      status: status || 'open',
      userId: userId || 1, // admin por padrão
      lastMessage: message,
    });

    // Criar mensagem associada
    await Message.create({
      ticketId: ticket.id,
      body: message,
      fromMe: false,
      read: false,
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error creating ticket via integration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota para o n8n enviar mensagens
router.post('/messages', validateIntegrationToken, async (req, res) => {
  try {
    const { ticketId, body, fromMe = false } = req.body;
    
    if (!ticketId || !body) {
      return res.status(400).json({ error: 'ticketId and body are required' });
    }

    const message = await Message.create({
      ticketId,
      body,
      fromMe,
      read: false,
    });

    // Atualizar última mensagem do ticket
    await Ticket.update(
      { lastMessage: body },
      { where: { id: ticketId } }
    );

    res.json({ success: true, message });
  } catch (error) {
    console.error('Error creating message via integration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota para o n8n buscar informações
router.get('/tickets/:id', validateIntegrationToken, async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        { model: Contact, as: 'contact' },
        { model: Message, as: 'messages' },
        { model: User, as: 'user' },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket via integration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota para o n8n atualizar status do ticket
router.patch('/tickets/:id/status', validateIntegrationToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.update({ status });
    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error updating ticket status via integration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
