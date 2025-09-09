import Product from '../models/Product';
import Setting from '../models/Setting';
import { Op } from 'sequelize';

export interface AIAnalysisResult {
  isPriceQuestion: boolean;
  isProductQuestion: boolean;
  detectedProduct?: string;
  confidence: number;
  suggestedResponse?: string;
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Analisa uma mensagem para detectar perguntas sobre preços/produtos
   */
  public async analyzeMessage(message: string, companyId: number): Promise<AIAnalysisResult> {
    const lowerMessage = message.toLowerCase().trim();
    
    // Padrões para detectar perguntas sobre preços
    const pricePatterns = [
      /preço|preco|valor|custo|quanto custa|quanto é|quanto vale/,
      /quanto sai|quanto fica|qual o preço|qual o valor/,
      /tem produto|tem disponível|tem em estoque/,
      /quero saber|gostaria de saber|pode me informar/,
      /r\$|reais|real|dólar|dolar|euro|centavos/
    ];

    // Padrões para detectar nomes de produtos
    const productPatterns = [
      /produto|item|artigo|mercadoria|bem/,
      /serviço|servico|atendimento|consulta/,
      /equipamento|ferramenta|material|insumo/
    ];

    let isPriceQuestion = false;
    let isProductQuestion = false;
    let confidence = 0;
    let detectedProduct = '';

    // Verificar se é uma pergunta sobre preço
    for (const pattern of pricePatterns) {
      if (pattern.test(lowerMessage)) {
        isPriceQuestion = true;
        confidence += 0.3;
        break;
      }
    }

    // Verificar se é uma pergunta sobre produto
    for (const pattern of productPatterns) {
      if (pattern.test(lowerMessage)) {
        isProductQuestion = true;
        confidence += 0.2;
        break;
      }
    }

    // Detectar palavras-chave específicas de produtos
    const productKeywords = await this.extractProductKeywords(lowerMessage, companyId);
    if (productKeywords.length > 0) {
      detectedProduct = productKeywords.join(' ');
      confidence += 0.4;
    }

    // Verificar se é uma pergunta (contém palavras interrogativas)
    const questionWords = ['quanto', 'qual', 'quais', 'tem', 'há', 'existe', 'pode', 'gostaria'];
    const hasQuestionWords = questionWords.some(word => lowerMessage.includes(word));
    if (hasQuestionWords) {
      confidence += 0.2;
    }

    // Limitar confiança a 1.0
    confidence = Math.min(confidence, 1.0);

    // Gerar resposta sugerida se for uma pergunta sobre preço
    let suggestedResponse = '';
    if (isPriceQuestion && confidence > 0.5) {
      suggestedResponse = await this.generatePriceResponse(detectedProduct, companyId);
    }

    return {
      isPriceQuestion,
      isProductQuestion,
      detectedProduct,
      confidence,
      suggestedResponse
    };
  }

  /**
   * Extrai palavras-chave de produtos da mensagem
   */
  private async extractProductKeywords(message: string, companyId: number): Promise<string[]> {
    // Buscar produtos da empresa
    const products = await Product.findAll({
      where: {
        companyId,
        active: true
      },
      attributes: ['name', 'category', 'description']
    });

    const keywords: string[] = [];
    
    for (const product of products) {
      const productName = product.name.toLowerCase();
      const productCategory = product.category?.toLowerCase() || '';
      const productDescription = product.description?.toLowerCase() || '';

      // Verificar se o nome do produto está na mensagem
      if (message.includes(productName)) {
        keywords.push(product.name);
      }

      // Verificar se a categoria está na mensagem
      if (productCategory && message.includes(productCategory)) {
        keywords.push(product.category);
      }

      // Verificar se palavras da descrição estão na mensagem
      const descriptionWords = productDescription.split(' ').filter(word => word.length > 3);
      for (const word of descriptionWords) {
        if (message.includes(word)) {
          keywords.push(word);
        }
      }
    }

    return [...new Set(keywords)]; // Remove duplicatas
  }

  /**
   * Gera resposta sobre preços
   */
  private async generatePriceResponse(productKeywords: string, companyId: number): Promise<string> {
    if (!productKeywords) {
      return this.generateGeneralPriceResponse(companyId);
    }

    // Buscar produtos específicos
    const products = await Product.findAll({
      where: {
        companyId,
        active: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${productKeywords}%` } },
          { category: { [Op.iLike]: `%${productKeywords}%` } },
          { description: { [Op.iLike]: `%${productKeywords}%` } }
        ]
      },
      limit: 5
    });

    if (products.length === 0) {
      return this.generateGeneralPriceResponse(companyId);
    }

    let response = `🔍 **Produtos encontrados para "${productKeywords}":**\n\n`;
    
    for (const product of products) {
      // Tratar diferentes tipos de price (string, number, etc.)
      let priceStr = 'Preço não disponível';
      if (product.price !== null && product.price !== undefined) {
        if (typeof product.price === 'number') {
          priceStr = product.price.toFixed(2);
        } else if (typeof product.price === 'string') {
          const numPrice = parseFloat(product.price);
          if (!isNaN(numPrice)) {
            priceStr = numPrice.toFixed(2);
          } else {
            priceStr = product.price;
          }
        } else {
          priceStr = String(product.price);
        }
      }
      
      const currency = product.currency || 'BRL';
      const stock = product.stock > 0 ? `✅ Em estoque (${product.stock})` : '❌ Sem estoque';
      
      response += `📦 **${product.name}**\n`;
      response += `💰 Preço: R$ ${priceStr}\n`;
      response += `📋 ${stock}\n`;
      if (product.description) {
        response += `📝 ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}\n`;
      }
      response += `\n`;
    }

    response += `💡 **Precisa de mais informações?** Entre em contato com nosso time de vendas!`;
    
    return response;
  }

  /**
   * Gera resposta geral sobre preços
   */
  private async generateGeneralPriceResponse(companyId: number): Promise<string> {
    const totalProducts = await Product.count({
      where: {
        companyId,
        active: true
      }
    });

    const categories = await Product.findAll({
      where: {
        companyId,
        active: true
      },
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    let response = `🏪 **Nossa Loja**\n\n`;
    response += `📊 Temos **${totalProducts} produtos** disponíveis\n`;
    
    if (categories.length > 0) {
      response += `📂 **Categorias:**\n`;
      categories.forEach(cat => {
        if (cat.category) {
          response += `• ${cat.category}\n`;
        }
      });
      response += `\n`;
    }

    response += `💡 **Para saber preços específicos:**\n`;
    response += `• Digite o nome do produto\n`;
    response += `• Ou mencione a categoria\n`;
    response += `• Exemplo: "Quanto custa [nome do produto]?"\n\n`;
    response += `🛒 **Quer ver todos os produtos?** Acesse nosso catálogo ou entre em contato!`;

    return response;
  }

  /**
   * Verifica se deve responder automaticamente
   */
  public async shouldAutoRespond(analysis: AIAnalysisResult, companyId: number): Promise<boolean> {
    // Verificar se o bot de preços está ativado para esta empresa
    const priceBotSetting = await Setting.findOne({
      where: {
        companyId,
        key: 'priceBotEnabled'
      }
    });

    const isPriceBotEnabled = priceBotSetting?.value === 'enabled';
    
    return isPriceBotEnabled && analysis.isPriceQuestion && analysis.confidence > 0.6;
  }
}
