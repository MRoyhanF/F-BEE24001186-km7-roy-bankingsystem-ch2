import { PrismaClient } from "@prisma/client";

export class AccountService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllAccount() {
    return this.prisma.bank_account.findMany();
  }

  async getAccountById(id) {
    return this.prisma.bank_account.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async createAccount(data) {
    return this.prisma.bank_account.create(data);
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
