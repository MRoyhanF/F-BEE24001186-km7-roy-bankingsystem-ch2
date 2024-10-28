import TransactionController from "../transactionController.js";
import { TransactionService } from "../../services/transactionService.js";
import { AccountService } from "../../services/accountService.js";
import { TransactionValidation } from "../../validations/transactionValidation.js";
import { ErrorHandler } from "../../middlewares/errorHandler.js";

jest.mock("../../services/transactionService.js");
jest.mock("../../services/accountService.js");
jest.mock("../../validations/transactionValidation.js");
jest.mock("../../middlewares/errorHandler.js");

describe("TransactionController", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: { id: 1 }, body: { source_account_id: 1, destination_account_id: 2, amount: 100 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTransaction", () => {
    it("should get all transaction", async () => {
      const transaction = [{ id: 1, amount: 100 }];
      TransactionService.prototype.getAllTransaction.mockResolvedValue(transaction);

      await TransactionController.getAllTransaction(req, res, next);

      expect(TransactionService.prototype.getAllTransaction).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Data: transaction });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      TransactionService.prototype.getAllTransaction.mockRejectedValue(error);

      await TransactionController.getAllTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("getTransactionById", () => {
    it("should get transaction by id", async () => {
      const transaction = { id: 1, amount: 100 };
      TransactionService.prototype.getTransactionById.mockResolvedValue(transaction);

      await TransactionController.getTransactionById(req, res, next);

      expect(TransactionService.prototype.getTransactionById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Data: transaction });
    });

    it("should transaction not found", async () => {
      TransactionService.prototype.getTransactionById.mockResolvedValue(null);

      await TransactionController.getTransactionById(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      TransactionService.prototype.getTransactionById.mockRejectedValue(error);

      await TransactionController.getTransactionById(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("createTransaction", () => {
    it("should create transaction", async () => {
      const sourceAccount = { id: 1, balance: 100 };
      const destinationAccount = { id: 2, balance: 200 };
      const transaction = { id: 1, amount: 100 };
      TransactionService.prototype.createTransaction.mockResolvedValue(transaction);
      AccountService.prototype.getAccountById.mockResolvedValueOnce(sourceAccount).mockResolvedValueOnce(destinationAccount);

      await TransactionController.createTransaction(req, res, next);

      expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(2);
      expect(TransactionService.prototype.createTransaction).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Data: transaction });
    });

    it("should source account not found", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue(null);

      await TransactionController.createTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should destination account not found", async () => {
      AccountService.prototype.getAccountById.mockResolvedValueOnce({ id: 1, balance: 100 }).mockResolvedValueOnce(null);

      await TransactionController.createTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should source and destination account cannot be the same", async () => {
      AccountService.prototype.getAccountById.mockResolvedValueOnce({ id: 1, balance: 100 }).mockResolvedValueOnce({ id: 1, balance: 100 });

      await TransactionController.createTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should insufficient balance", async () => {
      AccountService.prototype.getAccountById.mockResolvedValueOnce({ id: 1, balance: 100 }).mockResolvedValueOnce({ id: 2, balance: 200 });
      req.body.amount = 200;

      await TransactionController.createTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      TransactionService.prototype.createTransaction.mockRejectedValue(error);

      await TransactionController.createTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("deleteTransaction", () => {
    it("should delete transaction", async () => {
      const transaction = { id: 1, amount: 100 };
      TransactionService.prototype.getTransactionById.mockResolvedValue(transaction);

      await TransactionController.deleteTransaction(req, res, next);

      expect(TransactionService.prototype.getTransactionById).toHaveBeenCalledTimes(1);
      expect(TransactionService.prototype.deleteTransaction).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Message: "Transaction Deleted Successfully" });
    });

    it("should transaction not found", async () => {
      TransactionService.prototype.getTransactionById.mockResolvedValue(null);

      await TransactionController.deleteTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      TransactionService.prototype.deleteTransaction.mockRejectedValue(error);

      await TransactionController.deleteTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("withdrawTransaction", () => {
    it("should withdraw transaction", async () => {
      const account = { id: 1, balance: 100 };
      AccountService.prototype.getAccountById.mockResolvedValue(account);

      await TransactionController.withdrawTransaction(req, res, next);

      expect(TransactionService.prototype.withdrawTransaction).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Message: "Withdrawal Success", Data: account });
    });

    it("should account not found", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue(null);

      await TransactionController.withdrawTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should insufficient balance", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue({ id: 1, balance: 100 });
      req.body.amount = 200;

      await TransactionController.withdrawTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      TransactionService.prototype.withdrawTransaction.mockRejectedValue(error);

      await TransactionController.withdrawTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("depositTransaction", () => {
    it("should deposit transaction", async () => {
      const account = { id: 1, balance: 100 };
      AccountService.prototype.getAccountById.mockResolvedValue(account);

      await TransactionController.depositTransaction(req, res, next);

      expect(TransactionService.prototype.deposit).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Status: "Success", Message: "Deposit Success", Data: account });
    });

    it("should account not found", async () => {
      AccountService.prototype.getAccountById.mockResolvedValue(null);

      await TransactionController.depositTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      TransactionService.prototype.deposit.mockRejectedValue(error);

      await TransactionController.depositTransaction(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });
});
