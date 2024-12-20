import "./config/instrument.js"
import * as Sentry from "@sentry/node";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger3.json" with { type: "json" };

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import ErrorHandler from "./middlewares/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
// const __filename = path.resolve();
const __dirname = path.dirname(__filename);
const viewsFolder = path.resolve(__dirname, '../views');

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', viewsFolder);

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  res.on("finish", () => {
    console.log(`[RESPONSE] ${res.statusCode} - ${res.statusMessage}`);
  });
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/", indexRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.get("/api/v1/error", () => {
  throw new Error("This is an error route");
});

// sentry setup
Sentry.setupExpressErrorHandler(app);

// app.use(handleError);
app.use(ErrorHandler.handleError);

export default app;
