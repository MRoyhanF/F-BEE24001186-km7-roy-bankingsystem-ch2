import { PrismaClient } from "@prisma/client";

export class PostService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllPosts() {
    return this.prisma.post.findMany();
  }

  async getPostById(id) {
    return this.prisma.post.findUnique({ where: { id: parseInt(id) } });
  }

  async createPost(data) {
    return this.prisma.post.create(data);
  }

  async updatePost(id, data) {
    return this.prisma.post.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async deletePost(id) {
    return this.prisma.post.delete({ where: { id: parseInt(id) } });
  }
}
