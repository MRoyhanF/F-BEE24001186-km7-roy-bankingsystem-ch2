import express from "express";
import { homePage, mailer, resetPassword, forgotPassword, notification } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", homePage);
router.get("/notification", notification);
router.get("/forgot-password", forgotPassword);
router.get("/reset-password", resetPassword);

// api
router.post("/api/v1/send-email", mailer);

export default router;
