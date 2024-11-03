import express from "express";
import UserController from "../controllers/userController.js";
import { checkToken } from "../middlewares/checkToken.js";
import { uploadController } from "../controllers/media.controller.js";
import { upload } from "../libs/multer.js";

const router = express.Router();

// router.get("/", checkToken, UserController.getAllUsers.bind(UserController));
// router.get("/:id", checkToken, UserController.getUserById.bind(UserController));
router.post("/", upload.single("foto"), UserController.storeUser.bind(UserController));
// router.patch("/:id", UserController.updateUser.bind(UserController));

// router.post("/upload", upload().single("image"), uploadController);

// router.delete("/:id", UserController.deleteUser.bind(UserController)); //delete masih bingung kalau di hapus pk ny dimana2

export default router;
