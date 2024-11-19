import { UserService } from "../services/userService.js";
import { UserValidation } from "../validations/userValidation.js";
import bcrypt from "bcrypt";
import { io } from "../../main.js";

import ResponseHandler from "../utils/response.js";
import { Error400, Error404 } from "../utils/custom_error.js";

class UserController {
  constructor() {
    this.userService = new UserService();
    this.response = new ResponseHandler();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      return this.response.res200("Success", users, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new Error404("User not found");
      return this.response.res200("Success", user, res);
    } catch (error) {
      if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async getUserByEmail(req, res) {
    try {
      const user = await this.userService.getUserByEmail(req.params.email);
      if (!user) throw new Error404("User not found");
      // return this.response.res200("Success", user, res);
      res.status(200).json({ status: "Success", data: user });
    } catch (error) {
      if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async updateUser(req, res) {
    try {
      const { name, email, password, profile } = req.body;

      let parsedProfile = {};
      if (profile) {
        try {
          parsedProfile = typeof profile === "string" ? JSON.parse(profile) : profile;
        } catch (error) {
          if (error instanceof Error400) {
            return this.response.res400(error.message, res);
          } else {
            return this.response.res500(res);
          }
        }
      }

      UserValidation.validate(UserValidation.updateUserSchema, {
        name,
        email,
        password,
        profile: parsedProfile,
      });

      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new Error404("User not found");

      if (req.body.email) {
        const existingUser = await this.userService.getUserByEmail(req.body.email);
        if (existingUser && existingUser.id !== user.id) throw new Error400("Email already exists");
      }

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      if (req.file) {
        await this.userService.deleteImageFromImageKit(user.foto);
        const imageUrl = await this.userService.uploadImageToImageKit(req.file);
        req.body.foto = imageUrl;
      }

      const updatedUser = await this.userService.updateUser(req.params.id, {
        ...req.body,
        profile: parsedProfile,
      });
      res.status(200).json({ status: "Success", data: updatedUser });
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { password, confPassword } = req.body;

      const user = await this.userService.getUserById(id);

      if (password !== confPassword) {
        io.emit("changePassword", `user by Email ${user.email} Failed to Change a Password`);
        throw new Error400("Password does not match");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await this.userService.updateUser(id, { password: hashedPassword });

      io.emit("changePassword", `user by Email ${user.email} Success to Change a Password`);
      return this.response.res200("Success", updatedUser, res);
    } catch (error) {
      if (error instanceof Error404) {
        return this.response.res404(error.message, res);
      } else if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }
}

export default new UserController();
