// import Joi from "joi";
// import { TransactionSevice } from "../services/transactionService.js";
// import { AccountService } from "../services/accountSevice.js";
// import { TransactionValidation } from "../validations/transactionValidation.js";
// import { ErrorHandler } from "../middlewares/errorHandler.js";

// class TransactionController {
//   constructor() {
//     this.transactionService = new TransactionSevice();
//     this.accountService = new AccountService();
//   }

//   async getAllTransaction(req, res, next) {
//     try {
//       const transaction = await this.transactionService.getAllTransaction();
//       res.status(200).json({ Status: "Success", Data: transaction });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async getTransactionById(req, res, next) {
//     try {
//       const transaction = await this.transactionService.getTransactionById(req.params.id);
//       if (!transaction) throw new ErrorHandler(404, "Transaction Not Found");
//       res.status(200).json({ Status: "Success", Data: transaction });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async createTransaction(req, res, next) {
//     try {
//       TransactionValidation.validate(TransactionValidation.createTransactionSchema, req.body);

//       const sourceAccount = await this.accountService.getAccountById(req.body.source_account_id);
//       if (!sourceAccount) throw new ErrorHandler(404, "Source Account Not Found");

//       const destinationAccount = await this.accountService.getAccountById(req.body.destination_account_id);
//       if (!destinationAccount) throw new ErrorHandler(404, "Destination Account Not Found");

//       if (sourceAccount.id === destinationAccount.id) {
//         throw new ErrorHandler(400, "Source and Destination Account Cannot Be The Same");
//       }

//       if (sourceAccount.balance < req.body.amount) {
//         throw new ErrorHandler(400, "Insufficient Balance");
//       } else {
//         const newSourceBalance = sourceAccount.balance - req.body.amount;
//         const newDestinationBalance = destinationAccount.balance + req.body.amount;

//         await this.accountService.updateAccount(sourceAccount.id, { balance: newSourceBalance });
//         await this.accountService.updateAccount(destinationAccount.id, { balance: newDestinationBalance });
//       }

//       const transaction = await this.transactionService.createTransaction(req.body);
//       res.status(201).json({ Status: "Success", Data: transaction });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async deleteTransaction(req, res, next) {
//     try {
//       const transaction = await this.transactionService.getTransactionById(req.params.id);
//       if (!transaction) throw new ErrorHandler(404, "Transaction Not Found");

//       await this.transactionService.deleteTransaction(req.params.id);
//       res.status(200).json({ Status: "Success", Message: "Transaction Deleted Successfully" });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async withdrawTransaction(req, res, next) {
//     try {
//       TransactionValidation.validate(TransactionValidation.transactionSchema, req.body);

//       const account = await this.accountService.getAccountById(req.params.id);
//       if (!account) throw new ErrorHandler(404, "Account Not Found");

//       if (account.balance < req.body.amount) {
//         throw new ErrorHandler(400, "Insufficient Balance");
//       }

//       await this.transactionService.withdrawTransaction(account.id, req.body.amount);
//       const accountStatus = await this.accountService.getAccountById(account.id);

//       res.status(200).json({ Status: "Success", Message: "Withdrawal Success", Data: accountStatus });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async depositTransaction(req, res, next) {
//     try {
//       TransactionValidation.validate(TransactionValidation.transactionSchema, req.body);

//       const account = await this.accountService.getAccountById(req.params.id);
//       if (!account) throw new ErrorHandler(404, "Account Not Found");

//       await this.transactionService.deposit(account.id, req.body.amount);

//       const accountStatus = await this.accountService.getAccountById(account.id);

//       res.status(200).json({ Status: "Success", Message: "Deposit Success", Data: accountStatus });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }
// }

// export default new TransactionController();

// unit test for transactionController with jest and mock function

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

      // expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
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

      // expect(AccountService.prototype.getAccountById).toHaveBeenCalledTimes(1);
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
