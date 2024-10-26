// import { UserService } from "../services/userService.js";
// import { ErrorHandler } from "../middlewares/errorHandler.js";
// import { UserValidation } from "../validations/userValidation.js";

// class UserController {
//   constructor() {
//     this.userService = new UserService();
//   }

//   async getAllUsers(req, res, next) {
//     try {
//       const users = await this.userService.getAllUsers();
//       res.status(200).json({ status: "Success", data: users });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async getUserById(req, res, next) {
//     try {
//       const user = await this.userService.getUserById(req.params.id);
//       if (!user) throw new ErrorHandler(404, "User not found");
//       res.status(200).json({ status: "Success", data: user });
//     } catch (error) {
//       next(new ErrorHandler(500, error.message));
//     }
//   }

//   async createUser(req, res, next) {
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

//   async updateUser(req, res, next) {
//     try {
//       UserValidation.validate(UserValidation.updateUserSchema, req.body);
//       const updatedUser = await this.userService.updateUser(req.params.id, req.body);
//       if (!updatedUser) throw new ErrorHandler(404, "User not found");
//       res.status(200).json({ status: "Success", data: updatedUser });
//     } catch (error) {
//       next(new ErrorHandler(400, error.message));
//     }
//   }
// }

// export default new UserController();

// testing the userController class methods using jest with generated mock functions for the service and validation classes
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
      const receivedError = next.mock.calls[0][0]; // Get the error passed to next

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      //   expect(receivedError.statusCode).toBe(500);
      //   expect(receivedError.message).toBe(error.message);
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

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.getUserById.mockRejectedValue(error);

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0]; // Get the error passed to next

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      //   expect(receivedError.statusCode).toBe(500);
      //   expect(receivedError.message).toBe(error.message);
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

    it("should handle error", async () => {
      const error = new Error("Internal server error");
      UserService.prototype.getUserByEmail.mockRejectedValue(error);

      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalled();
      const receivedError = next.mock.calls[0][0]; // Get the error passed to next

      expect(receivedError).toBeInstanceOf(ErrorHandler);
      //   expect(receivedError.statusCode).toBe(400);
      //   expect(receivedError.message).toBe(error.message);
    });
  });
});
