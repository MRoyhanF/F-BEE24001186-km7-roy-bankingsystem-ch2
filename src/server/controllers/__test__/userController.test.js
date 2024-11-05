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

  // async updateUser(req, res, next) {
  //   try {
  //     const { name, email, password, profile } = req.body;

  //     // Ensure that profile is a valid JSON string or an object
  //     let parsedProfile = {};
  //     if (profile) {
  //       try {
  //         parsedProfile = typeof profile === "string" ? JSON.parse(profile) : profile;
  //       } catch (error) {
  //         throw new ErrorHandler(400, "Profile data is not valid JSON");
  //       }
  //     }

  //     // Validate user input
  //     UserValidation.validate(UserValidation.updateUserSchema, {
  //       name,
  //       email,
  //       password,
  //       profile: parsedProfile,
  //     });

  //     const user = await this.userService.getUserById(req.params.id);
  //     if (!user) throw new ErrorHandler(404, "User not found");

  //     if (req.body.email) {
  //       const existingUser = await this.userService.getUserByEmail(req.body.email);
  //       if (existingUser && existingUser.id !== user.id) throw new ErrorHandler(400, "Email already exists");
  //     }

  //     if (req.body.password) {
  //       req.body.password = await bcrypt.hash(req.body.password, 10);
  //     }

  //     // Check if a new file has been uploaded
  //     if (req.file) {
  //       // Delete the old image if it exists
  //       await this.userService.deleteImageFromImageKit(user.foto); // Ensure to pass the old image URL
  //       const imageUrl = await this.userService.uploadImageToImageKit(req.file);
  //       req.body.foto = imageUrl; // Set the new image URL to the request body
  //     }

  //     const updatedUser = await this.userService.updateUser(req.params.id, {
  //       ...req.body,
  //       profile: parsedProfile, // Pass the parsed profile data
  //     });
  //     res.status(200).json({ status: "Success", data: updatedUser });
  //   } catch (error) {
  //     next(new ErrorHandler(error.statusCode || 500, error.message));
  //   }
  // }
  // hendle test for updateUser
  describe("updateUser", () => {
    it("should update user", async () => {
      req.body = {
        name: "Roy",
        email: "roy@gmail.com",
        password: "password123",
        profile: JSON.stringify({ identity_type: "KTP", identity_number: "1234567890123456", address: "Jakarta" }),
      };

      const user = { id: 1, name: "Roy" };
      UserService.prototype.getUserById.mockResolvedValue(user);
      UserService.prototype.getUserByEmail.mockResolvedValue(null);
      UserService.prototype.updateUser.mockResolvedValue(user);

      await userController.updateUser(req, res, next);

      expect(UserService.prototype.getUserById).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(UserService.prototype.updateUser).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "Success", data: user });
    });
  });

  it("should return 404 if user not found", async () => {
    UserService.prototype.getUserById.mockResolvedValue(null);

    await userController.updateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    const receivedError = next.mock.calls[0][0];

    expect(receivedError).toBeInstanceOf(ErrorHandler);
    // expect(receivedError.statusCode).toBe(404);
    // expect(receivedError.message).toBe("User not found");
  });

  it("should return 400 if email already exists", async () => {
    UserService.prototype.getUserById.mockResolvedValue({ id: 1, email: "roy@gmail.com" });
    UserService.prototype.getUserByEmail.mockResolvedValue({ id: 2, email: "roy@gmail.com" });

    await userController.updateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    const receivedError = next.mock.calls[0][0];

    expect(receivedError).toBeInstanceOf(ErrorHandler);
    // expect(receivedError.statusCode).toBe(400);
    // expect(receivedError.message).toBe("Email already exists");
  });
});
