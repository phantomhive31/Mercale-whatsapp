import Contact from '../models/Contact';
import ContactList from '../models/ContactList';
import ContactListItem from '../models/ContactListItem';
import { getIO } from '../libs/socket';
import moment from 'moment';
import SendWhatsAppMessage from './WbotServices/SendWhatsAppMessage';
import Ticket from '../models/Ticket';
import { Op } from 'sequelize';

export class OptinService {
  private static instance: OptinService;

  private constructor() {}

  public static getInstance(): OptinService {
    if (!OptinService.instance) {
      OptinService.instance = new OptinService();
    }
    return OptinService.instance;
  }

  /**
   * FUNCIONALIDADE COMPLETAMENTE REMOVIDA - Envia mensagem de opt-in para um contato
   */
  public async sendOptinMessage(contact: Contact, ticket?: Ticket): Promise<void> {
    // FUNCIONALIDADE COMPLETAMENTE REMOVIDA
    console.log('Opt-in functionality has been completely removed');
    return;
  }

  /**
   * Processa resposta de opt-in do contato
   */
  public async processOptinResponse(contact: Contact, response: string): Promise<void> {
    try {
      const isPositive = this.isPositiveResponse(response);
      
      if (isPositive) {
        await this.confirmOptin(contact);
      } else {
        await this.denyOptin(contact);
      }
    } catch (error) {
      console.error('Error processing opt-in response:', error);
    }
  }

  /**
   * Confirma opt-in do contato
   */
  public async confirmOptin(contact: Contact): Promise<void> {
    try {
      await contact.update({
        optinConfirmed: true,
        optinConfirmedAt: moment().toDate()
      });

      // Adiciona o contato à lista de campanhas
      await this.addToCampaignList(contact);

      console.log(`Opt-in confirmed for contact ${contact.id}`);
    } catch (error) {
      console.error('Error confirming opt-in:', error);
    }
  }

  /**
   * Remove opt-in do contato
   */
  public async denyOptin(contact: Contact): Promise<void> {
    try {
      await contact.update({
        optinConfirmed: false,
        optinConfirmedAt: null
      });

      // Remove o contato da lista de campanhas
      await this.removeFromCampaignList(contact);

      console.log(`Opt-in denied for contact ${contact.id}`);
    } catch (error) {
      console.error('Error denying opt-in:', error);
    }
  }

  /**
   * Adiciona contato à lista de campanhas
   */
  private async addToCampaignList(contact: Contact): Promise<void> {
    try {
      // Busca ou cria a lista de campanhas para a empresa
      const [contactList] = await ContactList.findOrCreate({
        where: {
          companyId: contact.companyId,
          name: 'Opt-in Confirmados'
        },
        defaults: {
          name: 'Opt-in Confirmados',
          companyId: contact.companyId
        }
      });

      // Adiciona o contato à lista
      await ContactListItem.findOrCreate({
        where: {
          contactListId: contactList.id,
          number: contact.number,
          companyId: contact.companyId
        },
        defaults: {
          contactListId: contactList.id,
          name: contact.name,
          number: contact.number,
          email: contact.email,
          companyId: contact.companyId,
          isWhatsappValid: true
        }
      });

      console.log(`Contact ${contact.id} added to campaign list ${contactList.id}`);
    } catch (error) {
      console.error('Error adding contact to campaign list:', error);
    }
  }

  /**
   * Remove contato da lista de campanhas
   */
  private async removeFromCampaignList(contact: Contact): Promise<void> {
    try {
      // Busca a lista de campanhas
      const contactList = await ContactList.findOne({
        where: {
          companyId: contact.companyId,
          name: 'Opt-in Confirmados'
        }
      });

      if (contactList) {
        // Remove o contato da lista
        await ContactListItem.destroy({
          where: {
            contactListId: contactList.id,
            number: contact.number,
            companyId: contact.companyId
          }
        });

        console.log(`Contact ${contact.id} removed from campaign list ${contactList.id}`);
      }
    } catch (error) {
      console.error('Error removing contact from campaign list:', error);
    }
  }

  /**
   * Verifica se a resposta é positiva
   */
  private isPositiveResponse(response: string): boolean {
    const positiveResponses = [
      'sim', 's', 'yes', 'y', 'ok', 'okay', 'claro', 'quero', 'aceito',
      'concordo', 'perfeito', 'ótimo', 'excelente', '👍', '✅', '🟢'
    ];

    return positiveResponses.some(positive => 
      response.toLowerCase().trim().includes(positive)
    );
  }

  /**
   * Verifica se um contato pode receber campanhas
   */
  public async canReceiveCampaigns(contact: Contact): Promise<boolean> {
    return contact.optinConfirmed === true;
  }

  /**
   * Obtém todos os contatos que confirmaram opt-in
   */
  public async getOptinConfirmedContacts(companyId: number): Promise<Contact[]> {
    return Contact.findAll({
      where: {
        companyId,
        optinConfirmed: true
      }
    });
  }

  /**
   * DESATIVADO - Retorna mensagem vazia para opt-in
   */
  private getOptinMessage(): string {
    // MENSAGEM DE OPT-IN COMPLETAMENTE REMOVIDA
    return '';
  }
}
