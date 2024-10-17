import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserService {
  // Membuat user baru
  async register(name, email, password) {
    const hashedPassword = await hashPassword(password);
    return prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  }

  // Mendapatkan user berdasarkan ID
  async getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  // Mendapatkan user berdasarkan email (untuk login)
  async getUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  // Update user
  async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  // Hapus user
  async deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  }

  // Login user
  async login(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token, user };
  }
}
