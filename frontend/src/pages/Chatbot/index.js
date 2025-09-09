import React from "react";
import { MainContainer } from "../../components/MainContainer";
import { MainHeader } from "../../components/MainHeader";
import { MainHeaderButtonsWrapper } from "../../components/MainHeaderButtonsWrapper";
import { Title } from "../../components/Title";
import ChatbotManager from "../../components/ChatbotManager";

const Chatbot = () => {
  return (
    <MainContainer>
      <MainHeader>
        <Title>Chatbot Inteligente</Title>
        <MainHeaderButtonsWrapper>
          {/* Botões adicionais podem ser adicionados aqui */}
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <ChatbotManager />
    </MainContainer>
  );
};

export default Chatbot;

