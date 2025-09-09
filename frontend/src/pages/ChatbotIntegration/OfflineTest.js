import React, { useState } from "react";
import {
  Paper,
  Typography,
  Switch,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from "@material-ui/core";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  SmartToy as BotIcon,
  TestTube as TestIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  Warning as WarningIcon
} from "@material-ui/icons";
import { toast } from "react-toastify";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chatbot-tabpanel-${index}`}
      aria-labelledby={`chatbot-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const OfflineTest = () => {
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState({
    enabled: false,
    welcomeMessage: "Olá! Como posso ajudá-lo hoje?",
    fallbackMessage: "Desculpe, não entendi sua pergunta. Vou transferir você para um de nossos atendentes.",
    transferMessage: "Transferindo você para um de nossos atendentes. Aguarde um momento.",
    maxAttempts: 3,
    keywords: {}
  });
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [newKeyword, setNewKeyword] = useState({
    keyword: "",
    response: "",
    confidence: 0.7,
    transferToHuman: false
  });
  const [stats, setStats] = useState({
    totalInteractions: 0,
    successfulResponses: 0,
    transfersToHuman: 0,
    averageResponseTime: 0,
    mostCommonKeywords: []
  });

  const saveConfig = () => {
    setLoading(true);
    // Simular salvamento
    setTimeout(() => {
      setLoading(false);
      toast.success("Configuração salva com sucesso! (Modo offline)");
    }, 1000);
  };

  const testChatbot = () => {
    if (!testMessage.trim()) {
      toast.error("Digite uma mensagem para testar");
      return;
    }

    setLoading(true);
    
    // Simular análise do chatbot
    setTimeout(() => {
      const mockResponse = {
        message: testMessage,
        response: {
          shouldRespond: true,
          response: "Esta é uma resposta simulada do chatbot. (Modo offline)",
          confidence: 0.8,
          transferToHuman: false
        },
        timestamp: new Date().toISOString()
      };
      
      setTestResult(mockResponse);
      setTestDialogOpen(true);
      setLoading(false);
    }, 1000);
  };

  const addKeyword = () => {
    if (!newKeyword.keyword.trim() || !newKeyword.response.trim()) {
      toast.error("Preencha todos os campos da palavra-chave");
      return;
    }

    const updatedKeywords = {
      ...config.keywords,
      [newKeyword.keyword.toLowerCase()]: {
        response: newKeyword.response,
        confidence: newKeyword.confidence,
        transferToHuman: newKeyword.transferToHuman
      }
    };

    setConfig({
      ...config,
      keywords: updatedKeywords
    });

    setNewKeyword({
      keyword: "",
      response: "",
      confidence: 0.7,
      transferToHuman: false
    });

    toast.success("Palavra-chave adicionada com sucesso!");
  };

  const removeKeyword = (keyword) => {
    const updatedKeywords = { ...config.keywords };
    delete updatedKeywords[keyword];
    setConfig({
      ...config,
      keywords: updatedKeywords
    });
    toast.success("Palavra-chave removida com sucesso!");
  };

  const resetConfig = () => {
    if (window.confirm("Tem certeza que deseja resetar a configuração do chatbot?")) {
      setConfig({
        enabled: false,
        welcomeMessage: "Olá! Como posso ajudá-lo hoje?",
        fallbackMessage: "Desculpe, não entendi sua pergunta. Vou transferir você para um de nossos atendentes.",
        transferMessage: "Transferindo você para um de nossos atendentes. Aguarde um momento.",
        maxAttempts: 3,
        keywords: {}
      });
      toast.success("Configuração resetada com sucesso!");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Chatbot Inteligente</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetConfig}
            disabled={loading}
          >
            Resetar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={saveConfig}
            disabled={loading}
          >
            Salvar Configuração
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper style={{ margin: "20px", padding: "20px" }}>
        <Box display="flex" alignItems="center" marginBottom="20px">
          <BotIcon style={{ marginRight: "10px", fontSize: "2rem" }} />
          <Typography variant="h4">Gerenciador de Chatbot</Typography>
        </Box>

        <Alert severity="info" style={{ marginBottom: "20px" }}>
          <Typography variant="body2">
            <strong>Modo Offline:</strong> Esta versão funciona sem conexão com o backend. 
            As configurações são salvas localmente e o teste é simulado.
          </Typography>
        </Alert>

        <Typography variant="body1" color="textSecondary" paragraph>
          Configure seu chatbot inteligente para fazer o primeiro atendimento aos clientes.
          O chatbot pode responder perguntas comuns automaticamente e transferir conversas
          complexas para atendentes humanos.
        </Typography>

        <Divider style={{ margin: "20px 0" }} />

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="chatbot tabs">
          <Tab icon={<SettingsIcon />} label="Configurações" />
          <Tab icon={<AnalyticsIcon />} label="Estatísticas" />
          <Tab icon={<TestIcon />} label="Teste" />
          <Tab icon={<CodeIcon />} label="API" />
        </Tabs>

        {/* Tab Configurações */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Switch
                  checked={config.enabled}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  color="primary"
                />
                <Typography variant="body1" style={{ marginLeft: "10px" }}>
                  Habilitar Chatbot
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mensagem de Boas-vindas"
                multiline
                rows={3}
                value={config.welcomeMessage}
                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                helperText="Mensagem enviada quando o cliente inicia uma conversa"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mensagem de Fallback"
                multiline
                rows={3}
                value={config.fallbackMessage}
                onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
                helperText="Mensagem quando o chatbot não entende a pergunta"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mensagem de Transferência"
                multiline
                rows={3}
                value={config.transferMessage}
                onChange={(e) => setConfig({ ...config, transferMessage: e.target.value })}
                helperText="Mensagem enviada ao transferir para atendente humano"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Máximo de Tentativas</InputLabel>
                <Select
                  value={config.maxAttempts}
                  onChange={(e) => setConfig({ ...config, maxAttempts: e.target.value })}
                >
                  <MenuItem value={1}>1 tentativa</MenuItem>
                  <MenuItem value={2}>2 tentativas</MenuItem>
                  <MenuItem value={3}>3 tentativas</MenuItem>
                  <MenuItem value={5}>5 tentativas</MenuItem>
                  <MenuItem value={10}>10 tentativas</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Palavras-chave */}
            <Grid item xs={12}>
              <Divider style={{ margin: "20px 0" }} />
              <Typography variant="h6" gutterBottom>
                Palavras-chave e Respostas
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Palavra-chave"
                value={newKeyword.keyword}
                onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                placeholder="Ex: preço, valor, custo"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Resposta"
                multiline
                rows={2}
                value={newKeyword.response}
                onChange={(e) => setNewKeyword({ ...newKeyword, response: e.target.value })}
                placeholder="Resposta automática"
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Confiança</InputLabel>
                <Select
                  value={newKeyword.confidence}
                  onChange={(e) => setNewKeyword({ ...newKeyword, confidence: e.target.value })}
                >
                  <MenuItem value={0.5}>50%</MenuItem>
                  <MenuItem value={0.6}>60%</MenuItem>
                  <MenuItem value={0.7}>70%</MenuItem>
                  <MenuItem value={0.8}>80%</MenuItem>
                  <MenuItem value={0.9}>90%</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box display="flex" alignItems="center" height="100%">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={addKeyword}
                  fullWidth
                >
                  Adicionar
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" marginTop="10px">
                <Switch
                  checked={newKeyword.transferToHuman}
                  onChange={(e) => setNewKeyword({ ...newKeyword, transferToHuman: e.target.checked })}
                  color="primary"
                />
                <Typography variant="body2" style={{ marginLeft: "10px" }}>
                  Transferir para atendente humano após esta resposta
                </Typography>
              </Box>
            </Grid>

            {/* Lista de palavras-chave existentes */}
            <Grid item xs={12}>
              <Divider style={{ margin: "20px 0" }} />
              <Typography variant="subtitle1" gutterBottom>
                Palavras-chave Configuradas
              </Typography>
              <Box display="flex" flexWrap="wrap" gap="10px">
                {Object.entries(config.keywords).map(([keyword, data]) => (
                  <Card key={keyword} style={{ minWidth: "200px", marginBottom: "10px" }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {keyword}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {data.response}
                      </Typography>
                      <Box display="flex" alignItems="center" marginTop="10px">
                        <Chip
                          label={`${Math.round(data.confidence * 100)}% confiança`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {data.transferToHuman && (
                          <Chip
                            label="Transferir"
                            size="small"
                            color="secondary"
                            variant="outlined"
                            style={{ marginLeft: "5px" }}
                          />
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        size="small"
                        onClick={() => removeKeyword(keyword)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Estatísticas */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Interações
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalInteractions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Respostas Automáticas
                  </Typography>
                  <Typography variant="h4">
                    {stats.successfulResponses}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Transferências
                  </Typography>
                  <Typography variant="h4">
                    {stats.transfersToHuman}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tempo Médio (s)
                  </Typography>
                  <Typography variant="h4">
                    {stats.averageResponseTime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Teste */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Mensagem de Teste"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Digite uma mensagem para testar o chatbot"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<TestIcon />}
                onClick={testChatbot}
                disabled={loading}
                style={{ height: "56px" }}
              >
                Testar Chatbot
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab API */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Endpoints da API
          </Typography>
          <Alert severity="warning" style={{ marginBottom: "20px" }}>
            <Typography variant="body2">
              <strong>Backend não conectado:</strong> Para usar a API real, inicie o backend na porta 8080.
            </Typography>
          </Alert>
          <List>
            <ListItem>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText
                primary="GET /chatbot/config"
                secondary="Obter configuração atual do chatbot"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText
                primary="PUT /chatbot/config"
                secondary="Atualizar configuração do chatbot"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText
                primary="POST /chatbot/test"
                secondary="Testar uma mensagem com o chatbot"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText
                primary="GET /chatbot/stats"
                secondary="Obter estatísticas do chatbot"
              />
            </ListItem>
          </List>
        </TabPanel>
      </Paper>

      {/* Dialog de Teste */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resultado do Teste do Chatbot</DialogTitle>
        <DialogContent>
          {testResult && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Mensagem de Teste:</strong> {testResult.message}
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Resposta do Chatbot:</strong>
              </Typography>
              <Paper style={{ padding: "15px", backgroundColor: "#f5f5f5" }}>
                <Typography variant="body1">
                  {testResult.response?.response || "Nenhuma resposta"}
                </Typography>
              </Paper>
              <Box marginTop="15px">
                <Typography variant="body2" color="textSecondary">
                  <strong>Deve responder:</strong> {testResult.response?.shouldRespond ? "Sim" : "Não"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Confiança:</strong> {testResult.response?.confidence ? `${Math.round(testResult.response.confidence * 100)}%` : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Transferir para humano:</strong> {testResult.response?.transferToHuman ? "Sim" : "Não"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default OfflineTest;

