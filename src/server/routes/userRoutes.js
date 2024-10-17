import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.get("/", UserController.getAllUsers.bind(UserController));
router.get("/:id", UserController.getUserById.bind(UserController));
router.post("/", UserController.createUser.bind(UserController));
router.patch("/:id", UserController.updateUser.bind(UserController));
router.delete("/:id", UserController.deleteUser.bind(UserController));

export default router;
