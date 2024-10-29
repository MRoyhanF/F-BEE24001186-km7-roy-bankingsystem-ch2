import { TransactionService } from "../transactionService";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    transactions: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    bank_accounts: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe("TransactionService", () => {
  let transactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new instance of PrismaClient", () => {
    expect(PrismaClient).toHaveBeenCalledTimes(1);
  });

  describe("getAllTransaction", () => {
    it("should return all transactions with their source and destination account", async () => {
      const transactions = [
        {
          id: 1,
          amount: 100000,
          source_account: {
            bank_name: "BCA",
            bank_account_number: "1234567890",
            user: {
              name: "Fadhli",
              email: "fadhli@gmail.com",
            },
          },
          destination_account: {
            bank_name: "BNI",
            bank_account_number: "0987654321",
            user: {
              name: "Roy",
              email: "roy@gmail.com",
            },
          },
        },
        {
          id: 2,
          amount: 50000,
          source_account: {
            bank_name: "BNI",
            bank_account_number: "0987654321",
            user: {
              name: "Roy",
              email: "roy@gmail.com",
            },
          },
          destination_account: {
            bank_name: "BCA",
            bank_account_number: "1234567890",
            user: {
              name: "Fadhli",
              email: "fadhli@gmail.com",
            },
          },
        },
      ];

      transactionService.prisma.transactions.findMany.mockResolvedValue(transactions);
      const result = await transactionService.getAllTransaction();

      expect(result).toEqual([
        {
          transactionId: 1,
          sourceAccount: {
            bankName: "BCA",
            accountNumber: "1234567890",
            user: {
              name: "Fadhli",
              email: "fadhli@gmail.com",
            },
          },
          destinationAccount: {
            bankName: "BNI",
            accountNumber: "0987654321",
            user: {
              name: "Roy",
              email: "roy@gmail.com",
            },
          },
          amount: 100000,
        },
        {
          transactionId: 2,
          sourceAccount: {
            bankName: "BNI",
            accountNumber: "0987654321",
            user: {
              name: "Roy",
              email: "roy@gmail.com",
            },
          },
          destinationAccount: {
            bankName: "BCA",
            accountNumber: "1234567890",
            user: {
              name: "Fadhli",
              email: "fadhli@gmail.com",
            },
          },
          amount: 50000,
        },
      ]);
      expect(transactionService.prisma.transactions.findMany).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.transactions.findMany).toHaveBeenCalledWith({
        include: {
          source_account: {
            include: {
              user: true,
            },
          },
          destination_account: {
            include: {
              user: true,
            },
          },
        },
      });
    });
  });

  describe("getTransactionById", () => {
    it("should return a transaction by id with their source and destination account", async () => {
      const transaction = {
        id: 1,
        amount: 100000,
        source_account: {
          bank_name: "BCA",
          bank_account_number: "1234567890",
          user: {
            name: "Fadhli",
            email: "fadhli@gmail.com",
          },
        },
        destination_account: {
          bank_name: "BNI",
          bank_account_number: "0987654321",
          user: {
            name: "Roy",
            email: "roy@gmail.com",
          },
        },
      };

      transactionService.prisma.transactions.findUnique.mockResolvedValue(transaction);
      const result = await transactionService.getTransactionById(1);

      expect(result).toEqual({
        transactionId: 1,
        sourceAccount: {
          bankName: "BCA",
          accountNumber: "1234567890",
          user: {
            name: "Fadhli",
            email: "fadhli@gmail.com",
          },
        },
        destinationAccount: {
          bankName: "BNI",
          accountNumber: "0987654321",
          user: {
            name: "Roy",
            email: "roy@gmail.com",
          },
        },
        amount: 100000,
      });
      expect(transactionService.prisma.transactions.findUnique).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.transactions.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          source_account: {
            include: {
              user: true,
            },
          },
          destination_account: {
            include: {
              user: true,
            },
          },
        },
      });
    });

    it("should return null if transaction not found", async () => {
      transactionService.prisma.transactions.findUnique.mockResolvedValue(null);
      const result = await transactionService.getTransactionById(1);
      expect(result).toBeNull();
    });
  });

  describe("createTransaction", () => {
    it("should create a new transaction", async () => {
      const data = {
        amount: 100000,
        source_account_id: 1,
        destination_account_id: 2,
      };

      const transaction = {
        id: 1,
        amount: 100000,
        source_account: {
          bank_name: "BCA",
          bank_account_number: "1234567890",
          user: {
            name: "Fadhli",
            email: "fadhli@gmail.com",
          },
        },
        destination_account: {
          bank_name: "BNI",
          bank_account_number: "0987654321",
          user: {
            name: "Roy",
            email: "roy@gmail.com",
          },
        },
      };

      transactionService.prisma.transactions.create.mockResolvedValue(transaction);
      const result = await transactionService.createTransaction(data);

      expect(result).toEqual(transaction);
      expect(transactionService.prisma.transactions.create).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.transactions.create).toHaveBeenCalledWith({
        data: {
          amount: 100000,
          source_account: {
            connect: {
              id: 1,
            },
          },
          destination_account: {
            connect: {
              id: 2,
            },
          },
        },
      });
    });
  });

  describe("deleteTransaction", () => {
    it("should delete a transaction by id", async () => {
      transactionService.prisma.transactions.delete.mockResolvedValue({ id: 1 });
      const result = await transactionService.deleteTransaction(1);
      expect(result).toEqual({ id: 1 });
      expect(transactionService.prisma.transactions.delete).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.transactions.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("withdrawTransaction", () => {
    it("should withdraw an amount from an account", async () => {
      const account = {
        id: 1,
        balance: 1000000,
      };

      transactionService.prisma.bank_accounts.findUnique.mockResolvedValue(account);
      transactionService.prisma.bank_accounts.update.mockResolvedValue(account);
      const result = await transactionService.withdrawTransaction(1, 50000);

      expect(result).toEqual(account);
      expect(transactionService.prisma.bank_accounts.findUnique).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.bank_accounts.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(transactionService.prisma.bank_accounts.update).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.bank_accounts.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: 950000 },
      });
    });

    it("should throw an error if account not found", async () => {
      transactionService.prisma.bank_accounts.findUnique.mockResolvedValue(null);
      await expect(transactionService.withdrawTransaction(1, 50000)).rejects.toThrow("Account not found");
    });

    it("should throw an error if balance is insufficient", async () => {
      const account = {
        id: 1,
        balance: 10000,
      };

      transactionService.prisma.bank_accounts.findUnique.mockResolvedValue(account);
      await expect(transactionService.withdrawTransaction(1, 50000)).rejects.toThrow("Insufficient balance");
    });
  });

  describe("deposit", () => {
    it("should deposit an amount to an account", async () => {
      const account = {
        id: 1,
        balance: 1000000,
      };

      transactionService.prisma.bank_accounts.findUnique.mockResolvedValue(account);
      transactionService.prisma.bank_accounts.update.mockResolvedValue(account);
      const result = await transactionService.deposit(1, 50000);

      expect(result).toEqual(account);
      expect(transactionService.prisma.bank_accounts.findUnique).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.bank_accounts.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(transactionService.prisma.bank_accounts.update).toHaveBeenCalledTimes(1);
      expect(transactionService.prisma.bank_accounts.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: 1050000 },
      });
    });

    it("should throw an error if account not found", async () => {
      transactionService.prisma.bank_accounts.findUnique.mockResolvedValue(null);
      await expect(transactionService.deposit(1, 50000)).rejects.toThrow("Account not found");
    });
  });
});
