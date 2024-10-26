// import { PrismaClient } from "@prisma/client";

// export class TransactionSevice {
//   constructor() {
//     this.prisma = new PrismaClient();
//   }

//   async getAllTransaction() {
//     const transactions = await this.prisma.transactions.findMany({
//       include: {
//         source_account: {
//           include: {
//             user: true,
//           },
//         },
//         destination_account: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });

//     const customOutput = transactions.map((transaction) => ({
//       transactionId: transaction.id,
//       sourceAccount: {
//         bankName: transaction.source_account.bank_name,
//         accountNumber: transaction.source_account.bank_account_number,
//         user: {
//           name: transaction.source_account.user.name,
//           email: transaction.source_account.user.email,
//         },
//       },
//       destinationAccount: {
//         bankName: transaction.destination_account.bank_name,
//         accountNumber: transaction.destination_account.bank_account_number,
//         user: {
//           name: transaction.destination_account.user.name,
//           email: transaction.destination_account.user.email,
//         },
//       },
//       amount: transaction.amount,
//     }));

//     return customOutput;
//   }

//   async getTransactionById(id) {
//     const transaction = await this.prisma.transactions.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         source_account: {
//           include: {
//             user: true,
//           },
//         },
//         destination_account: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });

//     if (!transaction) return null;

//     const customOutput = {
//       transactionId: transaction.id,
//       sourceAccount: {
//         bankName: transaction.source_account.bank_name,
//         accountNumber: transaction.source_account.bank_account_number,
//         user: {
//           name: transaction.source_account.user.name,
//           email: transaction.source_account.user.email,
//         },
//       },
//       destinationAccount: {
//         bankName: transaction.destination_account.bank_name,
//         accountNumber: transaction.destination_account.bank_account_number,
//         user: {
//           name: transaction.destination_account.user.name,
//           email: transaction.destination_account.user.email,
//         },
//       },
//       amount: transaction.amount,
//     };

//     return customOutput;
//   }

//   async createTransaction(data) {
//     return this.prisma.transactions.create({
//       data: {
//         amount: data.amount,
//         source_account: {
//           connect: {
//             id: data.source_account_id,
//           },
//         },
//         destination_account: {
//           connect: {
//             id: data.destination_account_id,
//           },
//         },
//       },
//     });
//   }

//   async deleteTransaction(id) {
//     return this.prisma.transactions.delete({
//       where: { id: parseInt(id) },
//     });
//   }

//   async withdrawTransaction(id, amount) {
//     const account = await this.prisma.bank_accounts.findUnique({
//       where: { id: id },
//     });

//     if (!account) throw new Error("Account not found");

//     if (account.balance < amount) throw new Error("Insufficient balance");

//     const newBalance = account.balance - amount;

//     return this.prisma.bank_accounts.update({
//       where: { id: id },
//       data: { balance: newBalance },
//     });
//   }

//   async deposit(accountId, amount) {
//     const account = await this.prisma.bank_accounts.findUnique({
//       where: { id: accountId },
//     });

//     if (!account) throw new Error("Account not found");

//     const newBalance = account.balance + amount;

//     return this.prisma.bank_accounts.update({
//       where: { id: accountId },
//       data: { balance: newBalance },
//     });
//   }
// }

// unit test for transactionService.js file with jest and jest.mock function to mock the prisma client

import { TransactionSevice } from "../transactionService";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    transactions: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe("TransactionService", () => {
  let transactionService;

  beforeEach(() => {
    transactionService = new TransactionSevice();
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
});
