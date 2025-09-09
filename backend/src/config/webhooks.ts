export interface WebhookConfig {
  n8n: {
    baseUrl: string;
    webhookUrl: string;
    enabled: boolean;
  };
}

export const webhookConfig: WebhookConfig = {
  n8n: {
    baseUrl: process.env.N8N_BASE_URL || 'http://n8n:5678',
    webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/ticketz',
    enabled: process.env.N8N_ENABLED === 'true' || false,
  },
};
