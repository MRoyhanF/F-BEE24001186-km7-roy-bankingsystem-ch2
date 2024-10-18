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

  async getUserByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data) {
    const { profile, ...userData } = data;
    return this.prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: profile,
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async updateUser(id, data) {
    const { profile, ...userData } = data;
    const userId = parseInt(id);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userData,
      include: {
        profile: true,
      },
    });

    if (profile) {
      await this.updateProfile(userId, profile);
    }

    return updatedUser;
  }

  async updateProfile(userId, data) {
    const userProfile = await this.prisma.profile.findFirst({
      where: { user_id: userId },
    });

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    return this.prisma.profile.update({
      where: { id: userProfile.id },
      data,
    });
  }

  async deleteUser(id) {
    const userId = parseInt(id);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new Error("User not found");

    await this.prisma.profile.delete({
      where: { id: user.profile[0].id },
    });

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
