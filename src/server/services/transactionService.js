import { PrismaClient } from "@prisma/client";

export class TransactionSevice {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllTransaction() {
    const transactions = await this.prisma.transactions.findMany({
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

    const customOutput = transactions.map((transaction) => ({
      transactionId: transaction.id,
      sourceAccount: {
        bankName: transaction.source_account.bank_name,
        accountNumber: transaction.source_account.bank_account_number,
        user: {
          name: transaction.source_account.user.name,
          email: transaction.source_account.user.email,
        },
      },
      destinationAccount: {
        bankName: transaction.destination_account.bank_name,
        accountNumber: transaction.destination_account.bank_account_number,
        user: {
          name: transaction.destination_account.user.name,
          email: transaction.destination_account.user.email,
        },
      },
      amount: transaction.amount,
    }));

    return customOutput;
  }

  async getTransactionById(id) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { id: parseInt(id) },
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

    if (!transaction) return null;

    const customOutput = {
      transactionId: transaction.id,
      sourceAccount: {
        bankName: transaction.source_account.bank_name,
        accountNumber: transaction.source_account.bank_account_number,
        user: {
          name: transaction.source_account.user.name,
          email: transaction.source_account.user.email,
        },
      },
      destinationAccount: {
        bankName: transaction.destination_account.bank_name,
        accountNumber: transaction.destination_account.bank_account_number,
        user: {
          name: transaction.destination_account.user.name,
          email: transaction.destination_account.user.email,
        },
      },
      amount: transaction.amount,
    };

    return customOutput;
  }

  async createTransaction(data) {
    return this.prisma.transactions.create({
      data: {
        amount: data.amount,
        source_account: {
          connect: {
            id: data.source_account_id,
          },
        },
        destination_account: {
          connect: {
            id: data.destination_account_id,
          },
        },
      },
    });
  }

  async deleteTransaction(id) {
    return this.prisma.transactions.delete({
      where: { id: parseInt(id) },
    });
  }

  async withdrawTransaction(id, amount) {
    const account = await this.prisma.bank_accounts.findUnique({
      where: { id: id },
    });

    if (!account) throw new Error("Account not found");

    if (account.balance < amount) throw new Error("Insufficient balance");

    const newBalance = account.balance - amount;

    return this.prisma.bank_accounts.update({
      where: { id: id },
      data: { balance: newBalance },
    });
  }

  async deposit(accountId, amount) {
    const account = await this.prisma.bank_accounts.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error("Account not found");

    const newBalance = account.balance + amount;

    return this.prisma.bank_accounts.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });
  }
}
