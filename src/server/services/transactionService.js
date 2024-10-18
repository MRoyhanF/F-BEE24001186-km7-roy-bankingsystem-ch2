import { PrismaClient } from "@prisma/client";

export class accountService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllAccount() {
    return this.prisma.transaction.findMany();
  }

  async getAccountById(id) {
    return this.prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async createAccount(data) {
    return this.prisma.transaction.create(data);
  }

  async updateAccount(id, data) {
    return this.prisma.transaction.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async deleteAccount(id) {
    return this.prisma.transaction.delete({
      where: { id: parseInt(id) },
    });
  }
}
