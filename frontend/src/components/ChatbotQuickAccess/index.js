import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip
} from "@material-ui/core";
import {
  SmartToy as BotIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  TestTube as TestIcon
} from "@material-ui/icons";

const ChatbotQuickAccess = () => {
  const history = useHistory();

  const handleGoToChatbot = () => {
    history.push("/chatbot-integration");
  };

  return (
    <Card style={{ margin: "20px", maxWidth: "400px" }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom="15px">
          <BotIcon style={{ marginRight: "10px", fontSize: "2rem", color: "#1976d2" }} />
          <Typography variant="h6">Chatbot Inteligente</Typography>
        </Box>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Configure e gerencie seu chatbot para primeiro atendimento automático.
        </Typography>

        <Box display="flex" flexWrap="wrap" gap="5px" marginBottom="15px">
          <Chip label="Respostas Automáticas" size="small" color="primary" variant="outlined" />
          <Chip label="Análise de Intenção" size="small" color="primary" variant="outlined" />
          <Chip label="Transferência Inteligente" size="small" color="primary" variant="outlined" />
        </Box>

        <Typography variant="body2" color="textSecondary">
          <strong>Funcionalidades:</strong>
        </Typography>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Configuração de mensagens personalizadas</li>
          <li>Palavras-chave e respostas automáticas</li>
          <li>Teste em tempo real</li>
          <li>Estatísticas de uso</li>
          <li>API para integração</li>
        </ul>
      </CardContent>
      
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SettingsIcon />}
          onClick={handleGoToChatbot}
          fullWidth
        >
          Configurar Chatbot
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChatbotQuickAccess;

