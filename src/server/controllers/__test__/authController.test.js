// import { UserService } from "../services/userService.js";
// import { ErrorHandler } from "../middlewares/errorHandler.js";
// import jwt from "jsonwebtoken";
// import { UserValidation } from "../validations/userValidation.js";
// import { storeToken, isTokenLoggedOut } from "../utils/tokenStore.js";

// class AuthController {
//   constructor() {
//     this.userService = new UserService();
//   }

//   async register(req, res, next) {
//     try {
//       UserValidation.validate(UserValidation.createUserSchema, req.body);

//       const validEmail = await this.userService.getUserByEmail(req.body.email);
//       if (validEmail) throw new ErrorHandler(400, "Email already exists");

//       const newUser = await this.userService.createUser(req.body);
//       res.status(201).json({ status: "Success", data: newUser });
//     } catch (error) {
//       next(new ErrorHandler(400, error.message));
//     }
//   }

//   async login(req, res, next) {
//     try {
//       const { email, password, confmPassword } = req.body;

//       const user = await this.userService.getUserByEmail(email);
//       if (!user) throw new ErrorHandler(404, "User not found");

//       if (user.password !== password) throw new ErrorHandler(400, "Invalid password");
//       if (password !== confmPassword) throw new ErrorHandler(400, "Password does not match");

//       // Generate JWT token
//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//       res.status(200).json({ status: "Success", token });
//     } catch (error) {
//       next(new ErrorHandler(400, error.message));
//     }
//   }

//   async logout(req, res, next) {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];

//       if (!token) throw new ErrorHandler(400, "No token provided");

//       storeToken(token);

//       res.status(200).json({ status: "Success", message: "User logged out successfully" });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }
// }

// export default AuthController;

// unit testing for authController functions using jest and mock functions

import AuthController from "../authController";
import { UserService } from "../../services/userService";
import { ErrorHandler } from "../../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { UserValidation } from "../../validations/userValidation";
import { storeToken, isTokenLoggedOut } from "../../utils/tokenStore";

jest.mock("../../services/userService");
jest.mock("../../middlewares/errorHandler");
jest.mock("jsonwebtoken");
jest.mock("../../validations/userValidation");
jest.mock("../../utils/tokenStore");

describe("AuthController", () => {
  let authController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe("register", () => {
    it("should create a new user", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserValidation.validate.mockReturnValue();
      UserService.prototype.getUserByEmail.mockResolvedValue(null);
      UserService.prototype.createUser.mockResolvedValue({ email: "roy@gmail.com" });

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: { email: "roy@gmail.com" } });
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if email already exists", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserValidation.validate.mockReturnValue();
      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com" });

      await authController.register(req, res, next);

      expect(ErrorHandler).toHaveBeenCalledWith(400, "Email already exists");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com", password: "password123" });
      jwt.sign.mockReturnValue("token");

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", token: "token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if password is invalid", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com", password: "password" });

      await authController.login(req, res, next);

      expect(ErrorHandler).toHaveBeenCalledWith(400, "Invalid password");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should password and confirm password do not match", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password1234" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com", password: "password123" });

      await authController.login(req, res, next);

      expect(ErrorHandler).toHaveBeenCalledWith(400, "Password does not match");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should throw an error if user not found", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserService.prototype.getUserByEmail.mockResolvedValue(null);

      await authController.login(req, res, next);

      expect(ErrorHandler).toHaveBeenCalledWith(404, "User not found");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout a user", async () => {
      const req = { headers: { authorization: "Bearer token " } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      storeToken.mockReturnValue();
      await authController.logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", message: "User logged out successfully" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if no token provided", async () => {
      const req = { headers: { authorization: "" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await authController.logout(req, res, next);

      expect(ErrorHandler).toHaveBeenCalledWith(400, "No token provided");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
