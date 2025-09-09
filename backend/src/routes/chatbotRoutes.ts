import { Router } from "express";
import * as ChatbotController from "../controllers/ChatbotController";
import isAuth from "../middleware/isAuth";
import isAdmin from "../middleware/isAdmin";

const chatbotRoutes = Router();

// Middleware de autenticação para todas as rotas
chatbotRoutes.use(isAuth);

// Rotas do chatbot
chatbotRoutes.get("/config", ChatbotController.getChatbotConfig);
chatbotRoutes.put("/config", isAdmin, ChatbotController.updateChatbotConfig);
chatbotRoutes.post("/test", isAdmin, ChatbotController.testChatbotResponse);
chatbotRoutes.get("/stats", isAdmin, ChatbotController.getChatbotStats);
chatbotRoutes.post("/reset", isAdmin, ChatbotController.resetChatbotConfig);

export default chatbotRoutes;

