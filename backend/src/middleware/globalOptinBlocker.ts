/**
 * Bloqueador global de mensagens de opt-in
 * Intercepta qualquer tentativa de envio de mensagens de opt-in
 */

export class GlobalOptinBlocker {
  private static instance: GlobalOptinBlocker;
  private blockedCount = 0;

  private constructor() {}

  public static getInstance(): GlobalOptinBlocker {
    if (!GlobalOptinBlocker.instance) {
      GlobalOptinBlocker.instance = new GlobalOptinBlocker();
    }
    return GlobalOptinBlocker.instance;
  }

  /**
   * Verifica se uma mensagem é de opt-in e deve ser bloqueada
   */
  public isOptinMessage(message: string): boolean {
    if (!message) return false;

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
      'junte-se a nós'
    ];

    // Verifica padrões de texto
    const hasTextPattern = optinPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    // Verifica combinações específicas de emojis
    const hasOptinEmojis = message.includes('📢') && 
                          message.includes('🎉') && 
                          message.includes('✅') && 
                          message.includes('❌');

    // Verifica se contém "Sim" e "Não" juntos (típico de enquete)
    const hasYesNoOptions = message.includes('Sim') && message.includes('Não');

    // Verifica se contém "Responda:" seguido de opções
    const hasResponsePrompt = message.includes('Responda:') && 
                             (message.includes('Sim') || message.includes('Não'));

    return hasTextPattern || hasOptinEmojis || hasYesNoOptions || hasResponsePrompt;
  }

  /**
   * Bloqueia uma mensagem de opt-in
   */
  public blockMessage(message: string, source: string = 'unknown'): boolean {
    if (this.isOptinMessage(message)) {
      this.blockedCount++;
      console.log(`🚫 BLOCKED OPT-IN MESSAGE #${this.blockedCount} from ${source}:`);
      console.log(`   Content: ${message.substring(0, 100)}...`);
      return true;
    }
    return false;
  }

  /**
   * Retorna estatísticas de bloqueio
   */
  public getStats(): { blockedCount: number } {
    return { blockedCount: this.blockedCount };
  }

  /**
   * Reseta contador de bloqueios
   */
  public resetStats(): void {
    this.blockedCount = 0;
  }
}

export const globalOptinBlocker = GlobalOptinBlocker.getInstance();

