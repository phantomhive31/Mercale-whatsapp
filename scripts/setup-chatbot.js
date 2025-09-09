const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuração da API
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const API_TOKEN = process.env.API_TOKEN || 'your-api-token-here';

// Função para fazer requisições autenticadas
async function makeAuthenticatedRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Erro na requisição ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Função para carregar configuração do arquivo JSON
function loadChatbotConfig() {
  const configPath = path.join(__dirname, '..', 'examples', 'chatbot-config-example.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Arquivo de configuração não encontrado: ${configPath}`);
  }

  const configData = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configData);
}

// Função para testar a configuração do chatbot
async function testChatbotConfig() {
  console.log('🧪 Testando configuração do chatbot...');
  
  const testMessages = [
    'Olá, bom dia!',
    'Qual o preço do produto?',
    'Estou com um problema técnico',
    'Qual o horário de funcionamento?',
    'Obrigado pela ajuda!'
  ];

  for (const message of testMessages) {
    try {
      console.log(`\n📝 Testando: "${message}"`);
      const result = await makeAuthenticatedRequest('POST', '/chatbot/test', { message });
      
      console.log(`✅ Deve responder: ${result.response?.shouldRespond ? 'Sim' : 'Não'}`);
      console.log(`📊 Confiança: ${result.response?.confidence ? Math.round(result.response.confidence * 100) + '%' : 'N/A'}`);
      console.log(`🔄 Transferir: ${result.response?.transferToHuman ? 'Sim' : 'Não'}`);
      console.log(`💬 Resposta: ${result.response?.response || 'Nenhuma'}`);
    } catch (error) {
      console.error(`❌ Erro ao testar mensagem "${message}":`, error.message);
    }
  }
}

// Função principal
async function setupChatbot() {
  try {
    console.log('🤖 Configurando Chatbot Inteligente...\n');

    // 1. Carregar configuração
    console.log('📋 Carregando configuração do arquivo...');
    const config = loadChatbotConfig();
    console.log(`✅ Configuração carregada: ${Object.keys(config.keywords).length} palavras-chave configuradas`);

    // 2. Salvar configuração
    console.log('\n💾 Salvando configuração no sistema...');
    await makeAuthenticatedRequest('PUT', '/chatbot/config', config);
    console.log('✅ Configuração salva com sucesso!');

    // 3. Verificar configuração salva
    console.log('\n🔍 Verificando configuração salva...');
    const savedConfig = await makeAuthenticatedRequest('GET', '/chatbot/config');
    console.log(`✅ Configuração verificada: Chatbot ${savedConfig.enabled ? 'habilitado' : 'desabilitado'}`);

    // 4. Testar configuração
    await testChatbotConfig();

    console.log('\n🎉 Configuração do chatbot concluída com sucesso!');
    console.log('\n📚 Próximos passos:');
    console.log('1. Acesse o painel administrativo');
    console.log('2. Vá para "Chatbot Inteligente" no menu lateral');
    console.log('3. Ajuste as configurações conforme necessário');
    console.log('4. Teste com mensagens reais de clientes');
    console.log('5. Monitore o desempenho e faça ajustes');

  } catch (error) {
    console.error('\n❌ Erro durante a configuração do chatbot:', error.message);
    console.log('\n🔧 Soluções possíveis:');
    console.log('1. Verifique se a API está rodando');
    console.log('2. Confirme se o token de API está correto');
    console.log('3. Verifique se o arquivo de configuração existe');
    console.log('4. Confirme se você tem permissões de administrador');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupChatbot();
}

module.exports = { setupChatbot, testChatbotConfig, loadChatbotConfig };

