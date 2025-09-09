/**
 * Middleware para bloquear mensagens de opt-in
 */

export function blockOptinMessages(messageBody: string): boolean {
  if (!messageBody) return false;

  const optinPatterns = [
    'Quer fazer parte da nossa comunidade',
    'ofertas exclusivas todos os dias',
    'As melhores promoções te esperam',
    'junte-se a nós',
    'comunidade e receber ofertas',
    'promoções te esperam',
    'Responda:',
    'fazer parte da nossa',
    'receber ofertas exclusivas',
    'melhores promoções',
    'junte-se a nós',
    '📢 Quer fazer',
    '🎉 As melhores',
    '✅ Sim',
    '❌ Não'
  ];

  // Verifica se a mensagem contém qualquer padrão de opt-in
  const containsOptinPattern = optinPatterns.some(pattern => 
    messageBody.toLowerCase().includes(pattern.toLowerCase())
  );

  // Verifica combinações específicas de emojis
  const hasOptinEmojis = messageBody.includes('📢') && 
                        messageBody.includes('🎉') && 
                        messageBody.includes('✅') && 
                        messageBody.includes('❌');

  // Verifica se contém "Sim" e "Não" juntos (típico de enquete)
  const hasYesNoOptions = messageBody.includes('Sim') && messageBody.includes('Não');

  return containsOptinPattern || hasOptinEmojis || hasYesNoOptions;
}

export function getBlockedMessage(): string {
  return 'Mensagem de opt-in bloqueada - funcionalidade desativada';
}
