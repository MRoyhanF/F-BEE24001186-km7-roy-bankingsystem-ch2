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
      next(new ErrorHandler(error.statusCode || 500, error.message));
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");
      res.status(200).json({ status: "Success", data: user });
    } catch (error) {
      next(new ErrorHandler(error.statusCode || 500, error.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      const { name, email, password, profile } = req.body;

      // Ensure that profile is a valid JSON string or an object
      let parsedProfile = {};
      if (profile) {
        try {
          parsedProfile = typeof profile === "string" ? JSON.parse(profile) : profile;
        } catch (error) {
          throw new ErrorHandler(400, "Profile data is not valid JSON");
        }
      }

      // Validate user input
      UserValidation.validate(UserValidation.updateUserSchema, {
        name,
        email,
        password,
        profile: parsedProfile,
      });

      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");

      if (req.body.email) {
        const existingUser = await this.userService.getUserByEmail(req.body.email);
        if (existingUser && existingUser.id !== user.id) throw new ErrorHandler(400, "Email already exists");
      }

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      // Check if a new file has been uploaded
      if (req.file) {
        // Delete the old image if it exists
        await this.userService.deleteImageFromImageKit(user.foto); // Ensure to pass the old image URL
        const imageUrl = await this.userService.uploadImageToImageKit(req.file);
        req.body.foto = imageUrl; // Set the new image URL to the request body
      }

      const updatedUser = await this.userService.updateUser(req.params.id, {
        ...req.body,
        profile: parsedProfile, // Pass the parsed profile data
      });
      res.status(200).json({ status: "Success", data: updatedUser });
    } catch (error) {
      next(new ErrorHandler(error.statusCode || 500, error.message));
    }
  }
}

export default new UserController();
