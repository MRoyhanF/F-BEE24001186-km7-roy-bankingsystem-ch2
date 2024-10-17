import { PostService } from "../services/postService.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class PostController {
  constructor() {
    this.postService = new PostService();
  }

  async getAllPosts(req, res, next) {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async getPostById(req, res, next) {
    try {
      const post = await this.postService.getPostById(req.params.id);
      if (!post) throw new ErrorHandler(404, "Post not found");
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async createPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const newPost = await this.postService.createPost({ ...req.body, published: false });
      res.status(201).json(newPost);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async updatePost(req, res, next) {
    try {
      const updatedPost = await this.postService.updatePost(req.params.id, req.body);
      if (!updatedPost) throw new ErrorHandler(404, "Post not found");
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const deletedPost = await this.postService.deletePost(req.params.id);
      if (!deletedPost) throw new ErrorHandler(404, "Post not found");
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
