import { UserService } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const hashedPassword = await hashPassword(req.body.password);
      const newUser = await this.userService.createUser({
        ...req.body,
        password: hashedPassword,
      });
      res.status(201).json(newUser);
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async loginUser(req, res, next) {
    try {
      const user = await this.userService.getUserByEmail(req.body.email);
      if (!user) throw new ErrorHandler(404, "User not found");

      const isPasswordValid = await verifyPassword(req.body.password, user.password);
      if (!isPasswordValid) throw new ErrorHandler(401, "Invalid credentials");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
