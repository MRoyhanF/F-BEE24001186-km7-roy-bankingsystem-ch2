import "./config/instrument.js"
import * as Sentry from "@sentry/node";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger2.json" with { type: "json" };
import nodemailer from 'nodemailer';

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import * as indexController from "./controllers/indexController.js";
// import { handleError } from "./middlewares/errorHandler.js";
import ErrorHandler from "./middlewares/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsFolder = path.resolve(__dirname, '../views');

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', viewsFolder);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.get("/", indexController.homePage);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.get("/api/v1/error", () => {
  throw new Error("This is an error route");
});

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 587,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
  }
});

// Endpoint untuk mengirim email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email terkirim: ', info.response);
      res.status(200).json({ message: 'Email berhasil dikirim', info: info.response });
  } catch (error) {
      console.error('Error saat mengirim email:', error);
      res.status(500).json({ message: 'Gagal mengirim email', error });
  }
});

Sentry.setupExpressErrorHandler(app);

// app.use(handleError);
app.use(ErrorHandler.handleError);

export default app;
