import userController from "../userController.js"; // no need to capitalize or instantiate
import { UserService } from "../../services/userService.js";
import { ErrorHandler } from "../../middlewares/errorHandler.js";
import { UserValidation } from "../../validations/userValidation.js";

jest.mock("../../services/userService.js");
jest.mock("../../middlewares/errorHandler.js");
jest.mock("../../validations/userValidation.js");

describe("UserController", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: { id: 1 }, body: { email: "roy@gmail.com" } };
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

      expect(UserService.prototype.getUserById).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.getUserById.mockRejectedValue(error);

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const newUser = { id: 1, name: "Roy" };
      UserService.prototype.getUserByEmail.mockResolvedValue(null);
      UserService.prototype.createUser.mockResolvedValue(newUser);

      await userController.createUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.createUser).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: newUser });
    });

    it("should handle validEmail", async () => {
      UserService.prototype.getUserByEmail.mockResolvedValue({ id: 1, name: "Roy" });

      await userController.createUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.getUserByEmail.mockRejectedValue(error);

      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const updatedUser = { id: 1, name: "Roy" };
      UserService.prototype.updateUser.mockResolvedValue(updatedUser);

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.updateUser).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: updatedUser });
    });

    it("should return 404 if user not found", async () => {
      UserService.prototype.updateUser.mockResolvedValue(null);

      await userController.updateUser(req, res, next);

      expect(UserValidation.validate).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.updateUser).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.updateUser.mockRejectedValue(error);

      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0];

      expect(receivedError).toBeInstanceOf(ErrorHandler);
    });
  });
});
