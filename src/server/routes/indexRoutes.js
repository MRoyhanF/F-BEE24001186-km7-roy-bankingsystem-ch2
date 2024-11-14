import express from "express";
import { homePage, mailer, resetPassword } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", homePage);
router.post("/send-email", mailer);
router.get("/reset-password", resetPassword);

export default router;
