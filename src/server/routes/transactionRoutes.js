import express from "express";
import TransactionController from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", TransactionController.getAllTransaction.bind(TransactionController));
router.get("/:id", TransactionController.getTransactionById.bind(TransactionController));
router.post("/", TransactionController.createTransaction.bind(TransactionController));
router.delete("/:id", TransactionController.deleteTransaction.bind(TransactionController));

router.put("/withdraw/:id", TransactionController.withdrawTransaction.bind(TransactionController));

export default router;
