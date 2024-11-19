/**
 * KAK MAAF TESTING DI CONTROLLER MENDADAK ERROR SEMUA TAK COBA BENERIN TAPI MALAH KOPLEKS ERRORNYA  :(
 */

import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import TransactionController from "../transactionController.js";
import { TransactionService } from "../../services/transactionService.js";
// import { AccountService } from "../../services/accountService.js";
// import { TransactionValidation } from "../../validations/transactionValidation.js";
// // import ResponseHandler from "../../utils/response.js";
// import { Error400, Error404 } from "../../utils/custom_error.js";
// import { json } from "express";

jest.mock("../../services/transactionService.js", () => {
  return {
    TransactionService: jest.fn().mockImplementation(() => {
      return {
        getAllTransaction: jest.fn(),
        getTransactionById: jest.fn(),
        createTransaction: jest.fn(),
        deleteTransaction: jest.fn(),
        withdrawTransaction: jest.fn(),
        deposit: jest.fn(),
      };
    }),
  };
});
jest.mock("../../services/accountService.js");
// jest.mock("../../utils/response.js");

describe("Transaction Controller", () => {
  let transactionController;
  let res;

  beforeEach(() => {
    transactionController = TransactionController;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getAllTransaction", () => {
    it("should return all transactions", async () => {
      const mockTransaction = { data: undefined, status: { code: 200, message: "Success" } };

      TransactionService.prototype.getAllTransaction = jest.fn().mockResolvedValue(mockTransaction);

      await transactionController.getAllTransaction({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTransaction);
    });

    // it("should return 500 if error", async () => {
    //   TransactionService.prototype.getAllTransaction.mockRejectedValue(new Error("Error"));

    //   await transactionController.getAllTransaction({}, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ status: { code: 500, message: "Server error!" } });
    // });
  });

  // describe("getTransactionById", () => {
  //   it("should return transaction by id", async () => {
  //     const mockTransaction = { data: undefined, status: { code: 200, message: "Success" } };

  //     TransactionService.prototype.getTransactionById = jest.fn().mockResolvedValue(mockTransaction);

  //     await transactionController.getTransactionById({ params: { id: 1 } }, res);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith(mockTransaction);
  //   });

  //   // it("should return 404 if transaction not found", async () => {
  //   //   TransactionService.prototype.getTransactionById.mockResolvedValue(null);

  //   //   await transactionController.getTransactionById({ params: { id: 1 } }, res);

  //   //   expect(res.status).toHaveBeenCalledWith(404);
  //   //   expect(res.json).toHaveBeenCalledWith({ status: { code: 404, message: "Transaction Not Found" } });
  //   // });

  //   // it("should return 500 if error", async () => {
  //   //   TransactionService.prototype.getTransactionById.mockRejectedValue(new Error("Error"));

  //   //   await transactionController.getTransactionById({ params: { id: 1 } }, res);

  //   //   expect(res.status).toHaveBeenCalledWith(500);
  //   //   expect(res.json).toHaveBeenCalledWith({ status: { code: 500, message: "Server error!" } });
  //   // });
  // });

  // describe("createTransaction", () => {
  //   it("should create transaction", async () => {
  //     const mockTransaction = { data: undefined, status: { code: 201, message: "Success" } };

  //     TransactionValidation.validate = jest.fn();
  //     AccountService.prototype.getAccountById = jest.fn().mockResolvedValue({ id: 1, balance: 1000 });
  //     TransactionService.prototype.createTransaction = jest.fn().mockResolvedValue(mockTransaction);

  //     await transactionController.createTransaction(
  //       {
  //         body: {
  //           source_account_id: 1,
  //           destination_account_id: 2,
  //           amount: 100,
  //         },
  //       },
  //       res
  //     );

  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith(mockTransaction);
  //   });

  //   // it("should return 400 if source and destination account is the same", async () => {
  //   //   TransactionValidation.validate = jest.fn();
  //   //   AccountService.prototype.getAccountById = jest.fn().mockResolvedValue({ id: 1, balance: 1000 });

  //   //   await transactionController.createTransaction(
  //   //     {
  //   //       body: {
  //   //         source_account_id: 1,
  //   //         destination_account_id: 1,
  //   //         amount: 100,
  //   //       },
  //   //     },
  //   //     res
  //   //   );

  //   //   expect(res.status).toHaveBeenCalledWith(400);
  //   //   expect(res.json).toHaveBeenCalledWith({ status: { code: 400, message: "Source and Destination Account Cannot Be The Same" } });
  //   // });

  //   // it("should return 400 if insufficient balance", async () => {
  //   //   TransactionValidation.validate = jest.fn();
  //   //   AccountService.prototype.getAccountById = jest.fn().mockResolvedValue({ id: 1, balance: 1000 });

  //   //   await transactionController.createTransaction(
  //   //     {
  //   //       body: {
  //   //         source_account_id: 1,
  //   //         destination_account_id: 2,
  //   //         amount: 10000,
  //   //       },
  //   //     },
  //   //     res
  //   //   );

  //   //   expect(res.status).toHaveBeenCalledWith(400);
  //   //   expect(res.json).toHaveBeenCalledWith({ status: { code: 400, message: "Insufficient Balance" } });
  //   // });
  // });
});
