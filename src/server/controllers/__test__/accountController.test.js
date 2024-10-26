// import { AccountService } from "../services/accountSevice.js";
// import { UserService } from "../services/userService.js";
// import { AccountValidation } from "../validations/accountValidation.js";
// import { ErrorHandler } from "../middlewares/errorHandler.js";

// class AccountController {
//   constructor() {
//     this.accountService = new AccountService();
//     this.userService = new UserService();
//   }

//   async getAllAccount(req, res, next) {
//     try {
//       const account = await this.accountService.getAllAccount();
//       res.status(200).json({ Status: "Success", Data: account });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async getAccountById(req, res, next) {
//     try {
//       const account = await this.accountService.getAccountById(req.params.id);
//       if (!account) throw new ErrorHandler(404, "User Not Found");
//       res.status(200).json({ Status: "Success", Data: account });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async createAccount(req, res, next) {
//     try {
//       AccountValidation.validate(AccountValidation.createAccountSchema, req.body);

//       const validAccount = await this.userService.getUserById(req.body.user_id);
//       if (!validAccount) throw new ErrorHandler(404, "User Not Found");

//       const existingAccount = await this.accountService.getAccountByUser(req.body.user_id);
//       if (existingAccount) {
//         throw new ErrorHandler(400, "User Already Has an Account");
//       }

//       const account = await this.accountService.createAccount(req.body);
//       res.status(201).json({ Status: "Success", Data: account });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async updateAccount(req, res, next) {
//     try {
//       AccountValidation.validate(AccountValidation.updateAccountSchema, req.body);

//       const validAccount = await this.accountService.getAccountById(req.params.id);
//       if (!validAccount) throw new ErrorHandler(404, "Account Not Found");

//       const existingAccount = await this.accountService.getAccountByUser(req.body.user_id);
//       if (existingAccount) {
//         throw new ErrorHandler(400, "User Already Has an Account");
//       }

//       const updatedAccount = await this.accountService.updateAccount(req.params.id, req.body);
//       res.status(200).json({ Status: "Success", Message: "Account Updated Successfully", Data: updatedAccount });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async deleteAccount(req, res, next) {
//     try {
//       const account = await this.accountService.getAccountById(req.params.id);
//       if (!account) throw new ErrorHandler(404, "Account Not Found");

//       await this.accountService.deleteAccount(req.params.id);
//       res.status(200).json({ Status: "Success", Message: "Account Deleted Successfully" });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }
// }

// export default new AccountController();

// testing accountController with jest and mock function

import AccountController from "../accountController";
import { AccountService } from "../../services/accountSevice";
import { UserService } from "../../services/userService";
import { AccountValidation } from "../../validations/accountValidation";
import { ErrorHandler } from "../../middlewares/errorHandler";

jest.mock("../../services/accountSevice");
jest.mock("../../services/userService");
jest.mock("../../validations/accountValidation");
jest.mock("../../middlewares/errorHandler");

describe("AccountController", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: { id: 1 }, body: { user_id: 1, account_number: 1234567890 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllAccount", () => {
    it("should get all account", async () => {
      const accounts = [{ id: 1, account_number: 1234567890 }];
      AccountService.prototype.getAllAccount.mockResolvedValue(accounts);

      await AccountController.getAllAccount(req, res, next);

      expect(AccountService.prototype.getAllAccount).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Data: accounts });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      AccountService.prototype.getAllAccount.mockRejectedValue(error);

      await AccountController.getAllAccount(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("getAccountById", () => {
    it("should get account by id", async () => {
      const account = { id: 1, account_number: 1234567890 };
      AccountService.prototype.getAccountById.mockResolvedValue(account);

      await AccountController.getAccountById(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Data: account });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      AccountService.prototype.getAccountById.mockRejectedValue(error);

      await AccountController.getAccountById(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("createAccount", () => {
    it("should create account", async () => {
      const account = { id: 1, account_number: 1234567890 };
      UserService.prototype.getUserById.mockResolvedValue(true);
      AccountService.prototype.getAccountByUser.mockResolvedValue(null);
      AccountService.prototype.createAccount.mockResolvedValue(account);

      await AccountController.createAccount(req, res, next);

      expect(UserService.prototype.getUserById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.createAccount).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Data: account });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.getUserById.mockRejectedValue(error);

      await AccountController.createAccount(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("updateAccount", () => {
    it("should update account", async () => {
      const account = { id: 1, account_number: 1234567890 };
      AccountService.prototype.getAccountById.mockResolvedValue(account);
      AccountService.prototype.getAccountByUser.mockResolvedValue(null);
      AccountService.prototype.updateAccount.mockResolvedValue(account);

      await AccountController.updateAccount(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.updateAccount).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Message: "Account Updated Successfully", Data: account });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      AccountService.prototype.getAccountById.mockRejectedValue(error);

      await AccountController.updateAccount(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("deleteAccount", () => {
    it("should delete account", async () => {
      const account = { id: 1, account_number: 1234567890 };
      AccountService.prototype.getAccountById.mockResolvedValue(account);

      await AccountController.deleteAccount(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.deleteAccount).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Message: "Account Deleted Successfully" });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      AccountService.prototype.getAccountById.mockRejectedValue(error);

      await AccountController.deleteAccount(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });
});
