import { TransactionService } from "../services/transactionService.js";
import { AccountService } from "../services/accountService.js";
import { TransactionValidation } from "../validations/transactionValidation.js";
// import { ErrorHandler } from "../middlewares/errorHandler.js";

import ResponseHandler from "../utils/response.js";
import { Error400, Error404 } from "../utils/custom_error.js";

class TransactionController {
  constructor() {
    this.transactionService = new TransactionService();
    this.accountService = new AccountService();
    this.response = new ResponseHandler();
  }

  async getAllTransaction(req, res) {
    try {
      const transaction = await this.transactionService.getAllTransaction();
      return this.response.res200("Success", transaction, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async getTransactionById(req, res) {
    try {
      const transaction = await this.transactionService.getTransactionById(req.params.id);
      if (!transaction) throw new Error404("Transaction Not Found");
      return this.response.res200("Success", transaction, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async createTransaction(req, res) {
    try {
      TransactionValidation.validate(TransactionValidation.createTransactionSchema, req.body);

      const sourceAccount = await this.accountService.getAccountById(req.body.source_account_id);
      if (!sourceAccount) throw new Error404("Source Account Not Found");

      const destinationAccount = await this.accountService.getAccountById(req.body.destination_account_id);
      if (!destinationAccount) throw new Error404("Destination Account Not Found");

      if (sourceAccount.id === destinationAccount.id) {
        throw new Error400("Source and Destination Account Cannot Be The Same");
      }

      if (sourceAccount.balance < req.body.amount) {
        throw new Error400("Insufficient Balance");
      } else {
        const newSourceBalance = sourceAccount.balance - req.body.amount;
        const newDestinationBalance = destinationAccount.balance + req.body.amount;

        await this.accountService.updateAccount(sourceAccount.id, { balance: newSourceBalance });
        await this.accountService.updateAccount(destinationAccount.id, { balance: newDestinationBalance });
      }

      const transaction = await this.transactionService.createTransaction(req.body);
      return this.response.res201("Success", transaction, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async deleteTransaction(req, res) {
    try {
      const transaction = await this.transactionService.getTransactionById(req.params.id);
      if (!transaction) throw new Error404("Transaction Not Found");

      await this.transactionService.deleteTransaction(req.params.id);
      res.status(200).json({ Status: "Success", Message: "Transaction Deleted Successfully" });
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async withdrawTransaction(req, res) {
    try {
      TransactionValidation.validate(TransactionValidation.transactionSchema, req.body);

      const account = await this.accountService.getAccountById(req.params.id);
      if (!account) throw new Error404("Account Not Found");

      if (account.balance < req.body.amount) {
        throw new Error400("Insufficient Balance");
      }

      await this.transactionService.withdrawTransaction(account.id, req.body.amount);
      const accountStatus = await this.accountService.getAccountById(account.id);

      res.status(200).json({ Status: "Success", Message: "Withdrawal Success", Data: accountStatus });
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async depositTransaction(req, res) {
    try {
      TransactionValidation.validate(TransactionValidation.transactionSchema, req.body);

      const account = await this.accountService.getAccountById(req.params.id);
      if (!account) throw new Error404("Account Not Found");

      await this.transactionService.deposit(account.id, req.body.amount);

      const accountStatus = await this.accountService.getAccountById(account.id);

      return this.response.res200("Success", accountStatus, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }
}

export default new TransactionController();
