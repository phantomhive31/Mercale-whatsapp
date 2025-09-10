import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import path from "path";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";
import { messageQueue, sendScheduledMessages } from "./queues";

class SystemError extends Error {
  code?: string;
}

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

app.set("queues", {
  messageQueue,
  sendScheduledMessages
});

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Permitir requisições sem origin (ex: mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      // Lista de origens permitidas
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:80",
        "http://127.0.0.1:80"
      ];
      
      // Permitir qualquer IP da rede local (172.x.x.x, 192.168.x.x, 10.x.x.x)
      const isLocalNetwork = /^https?:\/\/(172\.|192\.168\.|10\.|127\.0\.0\.1)/.test(origin);
      
      if (allowedOrigins.includes(origin) || isLocalNetwork) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    exposedHeaders: ["Content-Range", "X-Content-Range"]
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.get("/public/*", (req, res) => {
  const filePath = path.join(uploadConfig.directory, req.params[0]);

  if (filePath.endsWith(".aac")) {
    res.setHeader("Content-Type", "audio/aac");
  }

  res.download(filePath, (err: SystemError) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.status(404).end();
      } else {
        logger.debug(
          { err },
          `Error downloading file ${req.params[0]}: ${err.message}`
        );
        res.status(500).end();
      }
    }
  });
});

app.use((req, _res, next) => {
  const { method, url, query, body, headers } = req;
  logger.trace(
    { method, url, query, body, headers },
    `Incoming request: ${req.method} ${req.url}`
  );
  next();
});

app.use(routes);

app.use(Sentry.Handlers.errorHandler());
app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger[err.level](err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
