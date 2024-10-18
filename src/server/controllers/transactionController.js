import Joi from "joi";
import { TransactionSevice } from "../services/transactionService.js";
import { TransactionValidation } from "../validations/transactionValidation.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class TransactionController {
  constructor() {
    this.transactionService = new TransactionSevice();
  }

  async getAllTransaction(req, res, next) {
    try {
      const transaction = await this.transactionService.getAllTransaction();
      res.status(200).json({ Status: "Success", Data: transaction });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

export default new TransactionController();
