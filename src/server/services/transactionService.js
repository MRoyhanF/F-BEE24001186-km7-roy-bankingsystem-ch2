import { PrismaClient } from "@prisma/client";

export class TransactionSevice {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllTransaction() {
    const transactions = await this.prisma.transaction.findMany({
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
    const transaction = await this.prisma.transaction.findUnique({
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
    return this.prisma.transaction.create({
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
    return this.prisma.transaction.delete({
      where: { id: parseInt(id) },
    });
  }
}
