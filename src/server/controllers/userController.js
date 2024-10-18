import { UserService } from "../services/userService.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { UserValidation } from "../validations/userValidation.js";

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

      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({ status: "Success", data: newUser });
    } catch (error) {
      next(new ErrorHandler(400, error.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      UserValidation.validate(UserValidation.updateUserSchema, req.body);
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      if (!updatedUser) throw new ErrorHandler(404, "User not found");
      res.status(200).json({ status: "Success", data: updatedUser });
    } catch (error) {
      next(new ErrorHandler(400, error.message));
    }
  }

  // async deleteUser(req, res, next) {
  //   try {
  //     const deletedUser = await this.userService.deleteUser(req.params.id);
  //     if (!deletedUser) throw new ErrorHandler(404, "User not found");
  //     res.status(200).json({ status: "Success", message: "User deleted successfully" });
  //   } catch (error) {
  //     next(new ErrorHandler(500, error.message));
  //   }
  // }
}

export default new UserController();
