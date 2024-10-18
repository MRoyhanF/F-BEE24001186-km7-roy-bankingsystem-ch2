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
    const { profile, ...userData } = data; // Ekstrak data profil
    return this.prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: profile, // Buat profil baru
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async updateUser(id, data) {
    const { profile, ...userData } = data; // Extract profile data
    const userId = parseInt(id);

    // First, update user data
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userData, // Update user without profile
      include: {
        profile: true,
      },
    });

    // If profile data is provided, update the profile
    if (profile) {
      await this.updateProfile(userId, profile); // Call method to update profile
    }

    return updatedUser; // Return updated user
  }

  async updateProfile(userId, data) {
    // Fetch the user's profile based on user_id
    const userProfile = await this.prisma.profile.findFirst({
      where: { user_id: userId }, // Use findFirst to get the profile
    });

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    return this.prisma.profile.update({
      where: { id: userProfile.id }, // Update using the profile's unique id
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
