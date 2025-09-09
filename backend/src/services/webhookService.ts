import axios from 'axios';
import { webhookConfig } from '../config/webhooks';

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  source: 'ticketz';
}

export class WebhookService {
  private static instance: WebhookService;

  private constructor() {}

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  public async sendWebhook(event: string, data: any): Promise<void> {
    if (!webhookConfig.n8n.enabled) {
      console.log(`Webhook disabled for event: ${event}`);
      return;
    }

    try {
      const payload: WebhookPayload = {
        event,
        data,
        timestamp: new Date().toISOString(),
        source: 'ticketz',
      };

      await axios.post(webhookConfig.n8n.webhookUrl, payload, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Webhook sent successfully for event: ${event}`);
    } catch (error) {
      console.error(`Failed to send webhook for event: ${event}`, error);
    }
  }

  // Métodos específicos para eventos comuns
  public async ticketCreated(ticketData: any): Promise<void> {
    await this.sendWebhook('ticket.created', ticketData);
  }

  public async ticketUpdated(ticketData: any): Promise<void> {
    await this.sendWebhook('ticket.updated', ticketData);
  }

  public async messageReceived(messageData: any): Promise<void> {
    await this.sendWebhook('message.received', messageData);
  }

  public async contactCreated(contactData: any): Promise<void> {
    await this.sendWebhook('contact.created', contactData);
  }

  public async userLoggedIn(userData: any): Promise<void> {
    await this.sendWebhook('user.logged_in', userData);
  }
}
