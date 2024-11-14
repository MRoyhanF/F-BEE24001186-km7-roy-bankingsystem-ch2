import express from "express";
import { homePage, mailer, resetPassword, forgotPassword } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", homePage);
router.post("/send-email", mailer);
router.get("/forgot-password", forgotPassword);
router.get("/reset-password", resetPassword);

export default router;
