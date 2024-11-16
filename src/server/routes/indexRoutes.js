import express from "express";
import { homePage, mailer, resetPassword, forgotPassword, notification } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", homePage);
router.get("/notification", notification);
router.post("/send-email", mailer);
router.get("/forgot-password", forgotPassword);
router.get("/reset-password", resetPassword);

export default router;
