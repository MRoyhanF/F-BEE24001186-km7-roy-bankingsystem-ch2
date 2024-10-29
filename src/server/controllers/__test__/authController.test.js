import AuthController from "../authController";
import { UserService } from "../../services/userService";
import { ErrorHandler } from "../../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { UserValidation } from "../../validations/userValidation";
import { storeToken } from "../../utils/tokenStore";
import bcrypt from "bcrypt";

jest.mock("../../services/userService");
jest.mock("../../middlewares/errorHandler");
jest.mock("jsonwebtoken");
jest.mock("../../validations/userValidation");
jest.mock("../../utils/tokenStore");
jest.mock("bcrypt"); // Mock bcrypt

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
      bcrypt.hash.mockResolvedValue("hashedPassword123"); // Mock bcrypt.hash
      UserService.prototype.createUser.mockResolvedValue({ email: "roy@gmail.com" });

      await authController.register(req, res, next);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
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

      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com", password: "hashedPassword123" });
      bcrypt.compare.mockResolvedValue(true); // Mock bcrypt.compare
      jwt.sign.mockReturnValue("token");

      await authController.login(req, res, next);

      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", token: "token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if password is invalid", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com", password: "hashedPassword123" });
      bcrypt.compare.mockResolvedValue(false); // Mock bcrypt.compare for invalid password

      await authController.login(req, res, next);

      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword123");
      expect(ErrorHandler).toHaveBeenCalledWith(400, "Invalid password");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should throw an error if passwords do not match", async () => {
      const req = { body: { email: "roy@gmail.com", password: "password123", confmPassword: "password1234" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      UserService.prototype.getUserByEmail.mockResolvedValue({ email: "roy@gmail.com", password: "hashedPassword123" });
      bcrypt.compare.mockResolvedValue(true);

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
      const req = { headers: { authorization: "Bearer token" } };
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
