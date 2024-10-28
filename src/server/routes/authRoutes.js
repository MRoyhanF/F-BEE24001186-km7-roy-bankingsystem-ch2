import express from "express";
import AuthController from "../controllers/authController.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();
const authController = new AuthController();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", checkToken, authController.logout.bind(authController));

export default router;
