import express from "express";
import TransactionController from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", TransactionController.getAllTransaction.bind(TransactionController));
router.get("/:id", TransactionController.getTransactionById.bind(TransactionController));

export default router;
