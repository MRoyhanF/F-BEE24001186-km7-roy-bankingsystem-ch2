import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async register(data) {
    const { profile, ...userData } = data;
    return this.prisma.users.create({
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

  async login(email, password) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { user, token };
  }

  async verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  async logout() {
    //
  }
}
