import Joi from "joi";
import { UserService } from "../services/userService.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class UserController {
  constructor() {
    this.userService = new UserService();

    this.createUserSchema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      validPassword: Joi.string().valid(Joi.ref("password")).required(),
    });

    this.updateUserSchema = Joi.object({
      name: Joi.string().min(3).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      validPassword: Joi.string().valid(Joi.ref("password")).optional(),
    });
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ Status: "Success", Data: users });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");
      res.status(200).json({ Status: "Success", Data: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      await this.createUserSchema.validateAsync(req.body);

      const { name, email, password, validPassword } = req.body;
      if (password !== validPassword) {
        throw new ErrorHandler(400, "Password and validPassword do not match");
      }

      const newUser = await this.userService.createUser({
        name,
        email,
        password,
      });

      res.status(201).json({ Status: "Success", Data: newUser });
    } catch (error) {
      if (error.isJoi) {
        return next(new ErrorHandler(400, error.details[0].message));
      }
      next(new ErrorHandler(500, error.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      await this.updateUserSchema.validateAsync(req.body);

      const { name, email, password, validPassword } = req.body;
      const userId = req.params.id;

      const user = await this.userService.getUserById(userId);
      if (!user) throw new ErrorHandler(404, "User not found");

      if (password || validPassword) {
        if (password && password !== validPassword) {
          throw new ErrorHandler(400, "Password and validPassword do not match");
        }
      }

      const updateData = {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
      };

      const updatedUser = await this.userService.updateUser(userId, updateData);
      res.status(200).json({ Status: "Success", Data: updatedUser });
    } catch (error) {
      if (error.isJoi) {
        return next(new ErrorHandler(400, error.details[0].message));
      }
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id);
      if (!deletedUser) throw new ErrorHandler(404, "User not found");
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
