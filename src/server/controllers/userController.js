import { UserService } from "../services/userService.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { UserValidation } from "../validations/userValidation.js";
import bcrypt from "bcrypt";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ status: "Success", data: users });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");
      res.status(200).json({ status: "Success", data: user });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async createUser(req, res, next) {
    try {
      UserValidation.validate(UserValidation.createUserSchema, req.body);

      const validEmail = await this.userService.getUserByEmail(req.body.email);
      if (validEmail) throw new ErrorHandler(400, "Email already exists");

      req.body.password = await bcrypt.hash(req.body.password, 10);

      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({ status: "Success", data: newUser });
    } catch (error) {
      next(new ErrorHandler(400, error.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      UserValidation.validate(UserValidation.updateUserSchema, req.body);

      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");

      if (req.body.email) {
        const existingUser = await this.userService.getUserByEmail(req.body.email);
        if (existingUser && existingUser.id !== user.id) throw new ErrorHandler(400, "Email already exists");
      }

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      res.status(200).json({ status: "Success", data: updatedUser });
    } catch (error) {
      next(new ErrorHandler(400, error.message));
    }
  }
}

export default new UserController();
