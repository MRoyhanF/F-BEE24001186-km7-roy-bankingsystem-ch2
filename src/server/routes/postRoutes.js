import express from "express";
import PostController from "../controllers/postController.js";

const router = express.Router();

router.get("/", PostController.getAllPosts.bind(PostController));
router.get("/:id", PostController.getPostById.bind(PostController));
router.post("/", PostController.createPost.bind(PostController));
router.put("/:id", PostController.updatePost.bind(PostController));
router.delete("/:id", PostController.deletePost.bind(PostController));

export default router;
