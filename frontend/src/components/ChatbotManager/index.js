import React, { useState, useEffect } from "react";
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
  Alert,
  Snackbar,
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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  SmartToy as BotIcon,
  TestTube as TestIcon,
  Refresh as RefreshIcon
} from "@material-ui/icons";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/Auth/AuthContext";

const ChatbotManager = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get("/chatbot/config");
      setConfig(response.data);
    } catch (error) {
      console.error("Erro ao carregar configuração do chatbot:", error);
      toast.error("Erro ao carregar configuração do chatbot");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setLoading(true);
      await api.put("/chatbot/config", config);
      toast.success("Configuração do chatbot salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configuração do chatbot:", error);
      toast.error("Erro ao salvar configuração do chatbot");
    } finally {
      setLoading(false);
    }
  };

  const testChatbot = async () => {
    if (!testMessage.trim()) {
      toast.error("Digite uma mensagem para testar");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/chatbot/test", {
        message: testMessage
      });
      setTestResult(response.data);
      setTestDialogOpen(true);
    } catch (error) {
      console.error("Erro ao testar chatbot:", error);
      toast.error("Erro ao testar chatbot");
    } finally {
      setLoading(false);
    }
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

  const resetConfig = async () => {
    if (window.confirm("Tem certeza que deseja resetar a configuração do chatbot?")) {
      try {
        setLoading(true);
        await api.post("/chatbot/reset");
        await loadConfig();
        toast.success("Configuração resetada com sucesso!");
      } catch (error) {
        console.error("Erro ao resetar configuração:", error);
        toast.error("Erro ao resetar configuração");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Box display="flex" alignItems="center" marginBottom="20px">
          <BotIcon style={{ marginRight: "10px", fontSize: "2rem" }} />
          <Typography variant="h4">Gerenciador de Chatbot</Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" paragraph>
          Configure seu chatbot inteligente para fazer o primeiro atendimento aos clientes.
          O chatbot pode responder perguntas comuns automaticamente e transferir conversas
          complexas para atendentes humanos.
        </Typography>

        <Divider style={{ margin: "20px 0" }} />

        {/* Configurações Básicas */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Configurações Básicas</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Palavras-chave */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Palavras-chave e Respostas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Adicionar Nova Palavra-chave
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
          </AccordionDetails>
        </Accordion>

        {/* Teste do Chatbot */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Teste do Chatbot</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* Ações */}
        <Box display="flex" justifyContent="space-between" marginTop="30px">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetConfig}
            disabled={loading}
          >
            Resetar Configuração
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={saveConfig}
            disabled={loading}
            size="large"
          >
            Salvar Configuração
          </Button>
        </Box>
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
    </div>
  );
};

export default ChatbotManager;

