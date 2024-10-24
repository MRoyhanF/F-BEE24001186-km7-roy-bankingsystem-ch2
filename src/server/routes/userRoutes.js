import express from "express";
import UserController from "../controllers/userController.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/", UserController.getAllUsers.bind(UserController));
router.get("/:id", checkToken, UserController.getUserById.bind(UserController));
router.post("/", checkToken, UserController.createUser.bind(UserController));
router.patch("/:id", checkToken, UserController.updateUser.bind(UserController));
// router.delete("/:id", UserController.deleteUser.bind(UserController)); //delete masih bingung kalau di hapus pk ny dimana2

export default router;
