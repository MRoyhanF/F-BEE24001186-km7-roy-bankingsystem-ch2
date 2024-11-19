import { AccountService } from "../services/accountService.js";
import { UserService } from "../services/userService.js";
import { AccountValidation } from "../validations/accountValidation.js";

import ResponseHandler from "../utils/response.js";
import { Error400, Error404 } from "../utils/custom_error.js";

class AccountController {
  constructor() {
    this.accountService = new AccountService();
    this.userService = new UserService();
    this.response = new ResponseHandler();
  }

  async getAllAccount(req, res) {
    try {
      const account = await this.accountService.getAllAccount();
      // res.status(200).json({ Status: "Success", Data: account });
      return this.response.res200("Success", account, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async getAccountById(req, res) {
    try {
      const account = await this.accountService.getAccountById(req.params.id);
      if (!account) throw new Error404("Account not found");
      return this.response.res200("Success", account, res);
    } catch (error) {
      if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async createAccount(req, res) {
    try {
      AccountValidation.validate(AccountValidation.createAccountSchema, req.body);

      const validAccount = await this.userService.getUserById(req.body.user_id);
      if (!validAccount) throw new Error404("User not found");

      const existingAccount = await this.accountService.getAccountByUser(req.body.user_id);
      if (existingAccount) {
        throw new Error400("User already has an account");
      }

      const account = await this.accountService.createAccount(req.body);
      res.status(201).json({ Status: "Success", Data: account });
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

  async updateAccount(req, res) {
    try {
      AccountValidation.validate(AccountValidation.updateAccountSchema, req.body);

      const account = await this.accountService.getAccountById(req.params.id);

      if (!account) {
        throw new Error404("Account not found");
      }

      if (req.body.user_id) {
        const existingAccount = await this.accountService.getAccountByUser(req.body.user_id);
        if (existingAccount && existingAccount.id !== account.id) {
          throw new Error400("User already has an account");
        }
        if (!existingAccount) {
          throw new Error404("User not found");
        }
      }

      const updatedAccount = await this.accountService.updateAccount(req.params.id, req.body);

      res.status(200).json({ status: "Success", message: "Account updated successfully", data: updatedAccount });
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

  async deleteAccount(req, res) {
    try {
      const account = await this.accountService.getAccountById(req.params.id);
      if (!account) throw new Error404("Account not found");

      await this.accountService.deleteAccount(req.params.id);
      res.status(200).json({ Status: "Success", Message: "Account Deleted Successfully" });
    } catch (error) {
      if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }
}

export default new AccountController();
