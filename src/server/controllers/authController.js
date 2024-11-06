import { UserService } from "../services/userService.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import jwt from "jsonwebtoken";
import { UserValidation } from "../validations/userValidation.js";
import { storeToken } from "../utils/tokenStore.js";
import bcrypt from "bcrypt";

class AuthController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res, next) {
    try {
      const { name, email, password, profile } = req.body;

      UserValidation.validate(UserValidation.createUserSchema, {
        name,
        email,
        password,
        profile: JSON.parse(profile),
      });

      let imageUrl = null;
      if (req.file) {
        if (req.file.size > 1024 * 1024 * 2) {
          throw new ErrorHandler(400, "File size is too large");
        }
        imageUrl = await this.userService.uploadImageToImageKit(req.file);
      }

      const validEmail = await this.userService.getUserByEmail(email);
      if (validEmail) throw new ErrorHandler(400, "Email already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userService.createUser(
        {
          name,
          email,
          password: hashedPassword,
          profile: JSON.parse(profile),
        },
        imageUrl
      );

      res.status(201).json({ status: "Success", data: newUser });
    } catch (error) {
      next(new ErrorHandler(error.statusCode || 500, error.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password, confmPassword } = req.body;

      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new ErrorHandler(404, "User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new ErrorHandler(400, "Invalid password");

      if (password !== confmPassword) throw new ErrorHandler(400, "Password does not match");

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ status: "Success", token });
    } catch (error) {
      next(new ErrorHandler(error.statusCode || 500, error.message));
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) throw new ErrorHandler(400, "No token provided");

      storeToken(token);

      res.status(200).json({ status: "Success", message: "User logged out successfully" });
    } catch (error) {
      next(new ErrorHandler(error.statusCode || 500, error.message));
    }
  }
}

export default AuthController;
