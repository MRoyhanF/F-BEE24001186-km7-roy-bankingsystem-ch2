import ImageKit from "imagekit";
import { PrismaClient } from "@prisma/client";

export class UserService {
  constructor() {
    this.prisma = new PrismaClient();
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_API_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
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

  async uploadImageToImageKit(file) {
    try {
      const timestamp = Date.now();
      const newFileName = `${timestamp}-${file.originalname}`;

      const result = await this.imagekit.upload({
        file: file.buffer,
        fileName: newFileName,
        folder: "/photo",
      });

      return result.url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
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
}
