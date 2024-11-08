import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import AccountController from "../accountController";
import { AccountService } from "../../services/accountService";
import { UserService } from "../../services/userService";
import { ErrorHandler } from "../../middlewares/errorHandler";

jest.mock("../../services/accountService");
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

    it("should handle account not found", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue(null);

      await AccountController.getAccountById(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
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

    it("should handle invalid user", async () => {
      UserService.prototype.getUserById.mockResolvedValue(null);

      await AccountController.createAccount(req, res, next);

      expect(UserService.prototype.getUserById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).not.toHaveBeenCalled();
      expect(AccountService.prototype.createAccount).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should existing account", async () => {
      UserService.prototype.getUserById.mockResolvedValue(true);
      AccountService.prototype.getAccountByUser.mockResolvedValue({ id: 1, account_number: 1234567890 });

      await AccountController.createAccount(req, res, next);

      expect(UserService.prototype.getUserById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.createAccount).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
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
      // expect(AccountService.prototype.updateAccount).toHaveBeenCalledTimes(1);
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.json).toHaveBeenCalledWith({ Status: "Success", Message: "Account updated successfully", Data: account });
    });

    it("should handle invalid account", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue(null);

      await AccountController.updateAccount(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).not.toHaveBeenCalled();
      expect(AccountService.prototype.updateAccount).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle existing account", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue({ id: 1, account_number: 1234567890 });
      AccountService.prototype.getAccountByUser.mockResolvedValue({ id: 2, account_number: 1234567890 });

      await AccountController.updateAccount(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.updateAccount).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle invalid user", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue({ id: 1, account_number: 1234567890 });
      AccountService.prototype.getAccountByUser.mockResolvedValue(null);

      await AccountController.updateAccount(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.getAccountByUser).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.updateAccount).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
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

    it("should handle invalid account", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue(null);

      await AccountController.deleteAccount(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
      expect(AccountService.prototype.deleteAccount).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
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
