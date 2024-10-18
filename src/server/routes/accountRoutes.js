import express from "express";
import AccountController from "../controllers/accountController.js";

const router = express.Router();

router.get("/", AccountController.getAllAccount.bind(AccountController));

export default router;
