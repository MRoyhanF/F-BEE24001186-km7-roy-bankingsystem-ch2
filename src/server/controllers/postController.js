import { PostService } from "../services/postService.js";

const postService = new PostService();

// CRUD operations for Post
export const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: "Post not found" });
  }
};

export const createPost = async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await postService.createPost(title, content, authorId);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const updatedPost = await postService.updatePost(id, { title, content, published });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await postService.deletePost(id);
    res.status(204).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
