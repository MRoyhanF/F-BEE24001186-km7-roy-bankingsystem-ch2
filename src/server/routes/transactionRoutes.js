import express from "express";
import TransactionController from "../controllers/transactionController.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/", checkToken, TransactionController.getAllTransaction.bind(TransactionController));
router.get("/:id", checkToken, TransactionController.getTransactionById.bind(TransactionController));
router.post("/", checkToken, TransactionController.createTransaction.bind(TransactionController));
// router.delete("/:id", TransactionController.deleteTransaction.bind(TransactionController));

router.put("/withdraw/:id", TransactionController.withdrawTransaction.bind(TransactionController));
router.put("/deposit/:id", TransactionController.depositTransaction.bind(TransactionController));

export default router;
