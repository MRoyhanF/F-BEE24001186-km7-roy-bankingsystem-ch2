import { AccountService } from "../services/accountSevice.js";
import { UserService } from "../services/userService.js";
import { AccountValidation } from "../validations/accountValidation.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class AccountController {
  constructor() {
    this.accountService = new AccountService();
    this.userService = new UserService();
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

  async createAccount(req, res, next) {
    try {
      AccountValidation.validate(AccountValidation.createAccountSchema, req.body);

      const validAccount = await this.userService.getUserById(req.body.user_id);
      if (!validAccount) throw new ErrorHandler(404, "User Not Found");

      const existingAccount = await this.accountService.getAccountByUser(req.body.user_id);
      if (existingAccount) {
        throw new ErrorHandler(400, "User Already Has an Account");
      }

      const account = await this.accountService.createAccount(req.body);
      res.status(201).json({ Status: "Success", Data: account });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async updateAccount(req, res, next) {
    try {
      AccountValidation.validate(AccountValidation.updateAccountSchema, req.body);

      const validAccount = await this.accountService.getAccountById(req.params.id);
      if (!validAccount) throw new ErrorHandler(404, "Account Not Found");

      const existingAccount = await this.accountService.getAccountByUser(req.body.user_id);
      if (existingAccount) {
        throw new ErrorHandler(400, "User Already Has an Account");
      }

      const updatedAccount = await this.accountService.updateAccount(req.params.id, req.body);
      res.status(200).json({ Status: "Success", Message: "Account Updated Successfully", Data: updatedAccount });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const account = await this.accountService.getAccountById(req.params.id);
      if (!account) throw new ErrorHandler(404, "Account Not Found");

      await this.accountService.deleteAccount(req.params.id);
      res.status(200).json({ Status: "Success", Message: "Account Deleted Successfully" });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

export default new AccountController();
