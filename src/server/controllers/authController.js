import { UserService } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { UserValidation } from "../validations/userValidation.js";
import { storeToken } from "../utils/tokenStore.js";
import bcrypt from "bcrypt";

import ResponseHandler from "../utils/response.js";
import { Error400, Error404 } from "../utils/custom_error.js";

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.response = new ResponseHandler();
  }

  async register(req, res) {
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
          throw new Error400(400, "File size is too large");
        }
        imageUrl = await this.userService.uploadImageToImageKit(req.file);
      }

      const validEmail = await this.userService.getUserByEmail(email);
      if (validEmail) throw new Error400("Email already exists");

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

      return this.response.res201("User created successfully", newUser, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        console.log(error.message);
        return this.response.res500(res);
      }
    }
  }

  async login(req, res) {
    try {
      const { email, password, confmPassword } = req.body;

      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new Error404("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error400("Invalid password");

      if (password !== confmPassword) throw new Error400("Password does not match");

      const secretKey = process.env.JWT_SECRET || "secret";
      const token = jwt.sign({ id: user.id, name: user.name }, secretKey, { expiresIn: "1h" });

      return this.response.res200("Login successful", { token }, res);
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

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) throw new Error400("No token provided");

      storeToken(token);

      return this.response.res200("User logged out successfully", null, res);
    } catch (error) {
      if (error instanceof Error400) {
        return this.response.res400(error.message, res);
      } else {
        return this.response.res500(res);
      }
    }
  }
}

export default AuthController;
