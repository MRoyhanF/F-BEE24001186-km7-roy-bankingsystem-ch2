import Joi from "joi";
import { AccountService } from "../services/accountSevice.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class AccountController {
  constructor() {
    this.accountService = new AccountService();
  }

  async getAllAccount(req, res, next) {
    try {
      const account = await this.accountService.getAllAccount();
      res.status(200).json({ Status: "Success", Data: account });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async getAccountById(req, res, next) {
    try {
      const account = await this.accountService.getAccountById(req.params.id);
      if (!account) throw new ErrorHandler(404, "User Not Found");
      res.status(200).json({ Status: "Success", Data: account });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

export default new AccountController();
