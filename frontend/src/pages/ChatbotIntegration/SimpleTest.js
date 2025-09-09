import React from "react";
import { Typography, Paper, Box } from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

const SimpleTest = () => {
  return (
    <MainContainer>
      <MainHeader>
        <Title>Chatbot Inteligente - Teste</Title>
        <MainHeaderButtonsWrapper>
          {/* Botões de teste */}
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper style={{ margin: "20px", padding: "20px" }}>
        <Box display="flex" alignItems="center" marginBottom="20px">
          <Typography variant="h4">🤖 Teste do Chatbot</Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" paragraph>
          Esta é uma página de teste para verificar se o sistema está funcionando corretamente.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Status do Sistema:
        </Typography>
        <ul>
          <li>✅ Página carregada com sucesso</li>
          <li>✅ Componentes importados corretamente</li>
          <li>✅ Estrutura básica funcionando</li>
        </ul>

        <Typography variant="h6" gutterBottom>
          Próximos Passos:
        </Typography>
        <ol>
          <li>Verificar se esta página carrega corretamente</li>
          <li>Se sim, implementar funcionalidades completas</li>
          <li>Se não, investigar problemas de importação</li>
        </ol>
      </Paper>
    </MainContainer>
  );
};

export default SimpleTest;

