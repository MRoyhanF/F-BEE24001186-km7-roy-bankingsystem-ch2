import { PrismaClient } from "@prisma/client";

export class UserService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async getUserById(id) {
    return this.prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { profile: true },
    });
  }

  async createUser(data) {
    return this.prisma.user.create({ data });
  }

  async updateUser(id, data) {
    return this.prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async deleteUser(id) {
    return this.prisma.user.delete({ where: { id: parseInt(id) } });
  }
}
