import bodyParser from "body-parser";
import cors from "cors";
import { App } from "./app/App";
import { VariantController } from "./controller/VariantController";
import { testConnection } from "./config/database";

// I hate cors
const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
});

// My Controller
const CONTROLLERS = [new VariantController()];

// App Starter
const startServer = async () => {
  try {
    await testConnection();

    const app = new App({
      controllers: CONTROLLERS,
      middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        corsMiddleware,
      ],
    });

    app.listen();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
