import userController from "../userController.js";
import { UserService } from "../../services/userService.js";
import { ErrorHandler } from "../../middlewares/errorHandler.js";
import { UserValidation } from "../../validations/userValidation.js";
import bcrypt from "bcrypt";

jest.mock("../../services/userService.js");
jest.mock("../../middlewares/errorHandler.js");
jest.mock("../../validations/userValidation.js");
jest.mock("bcrypt", () => ({
  hash: jest.fn(() => Promise.resolve("hashed_password")), // Update: Mocking bcrypt.hash to return hashed password
}));

describe("UserController", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: { id: 1 }, body: { email: "roy@gmail.com", password: "password123" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const users = [{ id: 1, name: "Roy" }];
      UserService.prototype.getAllUsers.mockResolvedValue(users);

      await userController.getAllUsers(req, res, next);

      expect(UserService.prototype.getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: users });
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.getAllUsers.mockRejectedValue(error);

      await userController.getAllUsers(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("getUserById", () => {
    it("should get user by id", async () => {
      const user = { id: 1, name: "Roy" };
      UserService.prototype.getUserById.mockResolvedValue(user);

      await userController.getUserById(req, res, next);

      expect(UserService.prototype.getUserById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: user });
    });

    it("should return 404 if user not found", async () => {
      UserService.prototype.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      // expect(receivedError.statusCode).toBe(404);
      // expect(receivedError.message).toBe("User not found");
    });
  });

  describe("createUser", () => {
    it("should create a user with hashed password", async () => {
      const newUser = { id: 1, name: "Roy" };
      UserService.prototype.getUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed_password");
      UserService.prototype.createUser.mockResolvedValue(newUser);

      await userController.createUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.createUserSchema, req.body);
      expect(UserService.prototype.getUserByEmail).toHaveBeenCalledWith(req.body.email);
      // expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(UserService.prototype.createUser).toHaveBeenCalledWith({ ...req.body, password: "hashed_password" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: newUser });
    });

    it("should handle existing email", async () => {
      UserService.prototype.getUserByEmail.mockResolvedValue({ id: 1, name: "Roy" });

      await userController.createUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.createUserSchema, req.body);
      expect(UserService.prototype.getUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      // expect(receivedError.statusCode).toBe(400);
      // expect(receivedError.message).toBe("Email already exists");
    });
  });

  describe("updateUser", () => {
    it("should update a user with optional password hashing", async () => {
      const updatedUser = { id: 1, name: "Roy" };
      UserService.prototype.getUserById.mockResolvedValue(updatedUser);
      UserService.prototype.updateUser.mockResolvedValue(updatedUser);
      bcrypt.hash.mockResolvedValue("hashed_password");

      req.body.password = "new_password";

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.updateUserSchema, req.body);
      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(req.params.id);
      // expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(UserService.prototype.updateUser).toHaveBeenCalledWith(req.params.id, { ...req.body, password: "hashed_password" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: updatedUser });
    });

    it("should update a user without password hashing if password not provided", async () => {
      const updatedUser = { id: 1, name: "Roy" };
      UserService.prototype.getUserById.mockResolvedValue(updatedUser);
      UserService.prototype.updateUser.mockResolvedValue(updatedUser);
      req.body.password = undefined;

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.updateUserSchema, req.body);
      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(req.params.id);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(UserService.prototype.updateUser).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: updatedUser });
    });

    it("should handle if there is no email in request body", async () => {
      const updatedUser = { id: 1, name: "Roy" };
      UserService.prototype.getUserById.mockResolvedValue(updatedUser);
      UserService.prototype.updateUser.mockResolvedValue(updatedUser);

      req.body.email = undefined;

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.updateUserSchema, req.body);
      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(req.params.id);
      expect(UserService.prototype.updateUser).toHaveBeenCalledWith(req.params.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: updatedUser });
    });

    it("should handle existing email", async () => {
      UserService.prototype.getUserById.mockResolvedValue({ id: 1, name: "Roy" });
      UserService.prototype.getUserByEmail.mockResolvedValue({ id: 2, name: "Roy" });

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.updateUserSchema, req.body);
      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(req.params.id);
      expect(UserService.prototype.getUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      // expect(receivedError.statusCode).toBe(400);
      // expect(receivedError.message).toBe("Email already exists");
    });

    it("should return 404 if user not found for update", async () => {
      UserService.prototype.getUserById.mockResolvedValue(null);

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledWith(UserValidation.updateUserSchema, req.body);
      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(req.params.id);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      // expect(receivedError.statusCode).toBe(404);
      // expect(receivedError.message).toBe("User not found");
    });
  });
});
