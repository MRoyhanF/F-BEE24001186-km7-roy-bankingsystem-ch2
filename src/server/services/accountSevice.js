import { PrismaClient } from "@prisma/client";

export class AccountService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllAccount() {
    return this.prisma.bank_account.findMany({
      include: {
        user: true,
      },
    });
  }

  async getAccountById(id) {
    return this.prisma.bank_account.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
      },
    });
  }
  async getAccountByUser(user_id) {
    return this.prisma.bank_account.findFirst({
      where: {
        user_id: user_id,
      },
    });
  }

  async createAccount(data) {
    return this.prisma.bank_account.create({
      data: {
        bank_name: data.bank_name,
        bank_account_number: data.bank_account_number,
        balance: data.balance,
        user: {
          connect: {
            id: data.user_id,
          },
        },
      },
    });
  }

  async updateAccount(id, data) {
    return this.prisma.bank_account.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async deleteAccount(id) {
    return this.prisma.bank_account.delete({
      where: { id: parseInt(id) },
    });
  }
}
