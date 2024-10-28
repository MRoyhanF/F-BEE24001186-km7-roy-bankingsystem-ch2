import express from "express";
import AccountController from "../controllers/accountController.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/", checkToken, AccountController.getAllAccount.bind(AccountController));
router.get("/:id", checkToken, AccountController.getAccountById.bind(AccountController));
router.post("/", checkToken, AccountController.createAccount.bind(AccountController));
router.patch("/:id", checkToken, AccountController.updateAccount.bind(AccountController));
router.delete("/:id", checkToken, AccountController.deleteAccount.bind(AccountController));

export default router;
