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
    const { profile, ...userData } = data; // Ekstrak data profil
    const userId = parseInt(id);

    // Pertama, perbarui data pengguna
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userData, // Tidak menyertakan profil di sini
      include: {
        profile: true,
      },
    });

    // Jika ada data profil yang ingin diperbarui
    if (profile) {
      await this.updateProfile(userId, profile); // Memanggil metode updateProfile
    }

    return updatedUser; // Kembalikan pengguna yang diperbarui
  }

  async updateProfile(userId, data) {
    return this.prisma.profile.update({
      where: { user_id: parseInt(userId) }, // Menggunakan user_id sebagai kunci pencarian
      data,
    });
  }

  async deleteUser(id) {
    return this.prisma.user.delete({
      where: { id: parseInt(id) },
      include: { profile: true },
    });
  }
}
