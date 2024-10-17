import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostService {
  // Mendapatkan semua post
  async getAllPosts() {
    return prisma.post.findMany();
  }

  // Mendapatkan post berdasarkan ID
  async getPostById(id) {
    return prisma.post.findUnique({ where: { id } });
  }

  // Membuat post baru
  async createPost(title, content, authorId) {
    return prisma.post.create({
      data: { title, content, authorId },
    });
  }

  // Update post
  async updatePost(id, data) {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  // Hapus post
  async deletePost(id) {
    return prisma.post.delete({ where: { id } });
  }
}
