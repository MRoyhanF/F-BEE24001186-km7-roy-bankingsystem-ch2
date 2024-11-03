import express from "express";
import UserController from "../controllers/userController.js";
import { checkToken } from "../middlewares/checkToken.js";
import { upload } from "../libs/multer.js";

const router = express.Router();

router.get("/", checkToken, UserController.getAllUsers.bind(UserController));
router.get("/:id", checkToken, UserController.getUserById.bind(UserController));
router.patch("/:id", upload().single("file"), UserController.updateUser.bind(UserController));

// router.delete("/:id", UserController.deleteUser.bind(UserController)); //delete masih bingung kalau di hapus pk ny dimana2

export default router;
