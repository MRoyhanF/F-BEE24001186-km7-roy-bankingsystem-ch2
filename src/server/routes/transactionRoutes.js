import express from "express";
import TransactionController from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", TransactionController.getAllTransaction.bind(TransactionController));

export default router;
