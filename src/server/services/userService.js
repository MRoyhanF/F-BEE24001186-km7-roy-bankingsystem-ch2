import { PrismaClient } from "@prisma/client";

export class UserService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllUsers() {
    return this.prisma.users.findMany({
      include: {
        profile: true,
      },
    });
  }

  async getUserById(id) {
    return this.prisma.users.findUnique({
      where: { id: parseInt(id) },
      include: { profile: true },
    });
  }

  async getUserByEmail(email) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async createUser(data, imageUrl) {
    const { profile, ...userData } = data;
    return this.prisma.users.create({
      data: {
        ...userData,
        foto: imageUrl,
        profile: {
          create: profile,
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async storeUserAndProfile(data) {
    const { profile, ...userData } = data;

    const user = await this.prisma.users.create({
      data: userData,
    });

    await this.prisma.profiles.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });

    return user;
  }

  async updateUser(id, data) {
    const { profile, ...userData } = data;
    const userId = parseInt(id);

    const updatedUser = await this.prisma.users.update({
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
    const userProfile = await this.prisma.profiles.findFirst({
      where: { user_id: userId },
    });

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    return this.prisma.profiles.update({
      where: { id: userProfile.id },
      data,
    });
  }

  // async deleteUser(id) {
  //   const userId = parseInt(id);

  //   const user = await this.prisma.users.findUnique({
  //     where: { id: userId },
  //     include: { profile: true },
  //   });

  //   if (!user) throw new Error("User not found");

  //   await this.prisma.profiles.delete({
  //     where: { id: user.profile[0].id },
  //   });

  //   await this.prisma.bank_accounts.deleteMany({
  //     where: { user_id: userId },
  //   });

  //   return this.prisma.users.delete({
  //     where: { id: userId },
  //   });
  // }
}
