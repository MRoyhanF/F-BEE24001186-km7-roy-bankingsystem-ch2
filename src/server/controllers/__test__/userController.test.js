/* userController.js 
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

*/

/* userService.js
import ImageKit from "imagekit";
import { PrismaClient } from "@prisma/client";

export class UserService {
  constructor() {
    this.prisma = new PrismaClient();
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_API_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  async getAllUsers() {
    return this.prisma.users.findMany({
      include: {
        profile: true,
      },
    });
  }

  async getUserById(id) {
    return this.prisma.users.findUnique({
      where: { id: parseInt(id) },
      include: { profile: true },
    });
  }

  async getUserByEmail(email) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async uploadImageToImageKit(file) {
    try {
      const timestamp = Date.now();
      const newFileName = `${timestamp}-${file.originalname}`;

      const result = await this.imagekit.upload({
        file: file.buffer,
        fileName: newFileName,
        folder: "/photo",
      });

      return result.url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async createUser(data, imageUrl) {
    const { profile, ...userData } = data;
    return this.prisma.users.create({
      data: {
        ...userData,
        foto: imageUrl,
        profile: {
          create: profile,
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async updateUser(id, data) {
    const { profile, foto, ...userData } = data;
    const userId = parseInt(id);

    const existingUser = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (foto && existingUser.foto) {
      await this.deleteImageFromImageKit(existingUser.foto);
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        ...userData,
        foto: foto ? foto : existingUser.foto,
      },
      include: {
        profile: true,
      },
    });

    if (profile) {
      await this.updateProfile(userId, profile);
    }

    return updatedUser;
  }

  async updateProfile(userId, data) {
    const profileData = typeof data === "string" ? JSON.parse(data) : data;

    const userProfile = await this.prisma.profiles.findFirst({
      where: { user_id: userId },
    });

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    return this.prisma.profiles.update({
      where: { id: userProfile.id },
      data: profileData,
    });
  }

  async deleteImageFromImageKit(imageUrl) {
    if (!imageUrl) return;

    try {
      const fileId = imageUrl.split("/").pop().split(".")[0];
      await this.imagekit.deleteFile(fileId);
    } catch (error) {
      console.error(`Image delete failed: ${error.message}`);
    }
  }
}

*/

/* userValidation.js
import Joi from "joi";

export class UserValidation {
  static createUserSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.object({
      identity_type: Joi.string().valid("KTP", "SIM", "Passport").required(),
      identity_number: Joi.string().min(16).max(20).required(),
      address: Joi.string().min(3).required(),
    }).required(),
  }).messages({
    "object.unknown": "Input contains unknown keys",
  });

  static updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    profile: Joi.object({
      identity_type: Joi.string().valid("KTP", "SIM", "Passport"),
      identity_number: Joi.string().min(16).max(20),
      address: Joi.string().min(3),
    }),
  });

  static validate(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}

*/

/* response.js
class ResponseHandler {
  res200(message, data, res) {
    res.status(200).json({
      status: {
        code: 200,
        message,
      },
      data,
    });
  }

  res201(message, data, res) {
    res.status(201).json({
      status: {
        code: 201,
        message,
      },
      data,
    });
  }

  res400(msg, res) {
    res.status(400).json({
      status: {
        code: 400,
        message: "Bad Request! - " + msg,
      },
      data: null,
    });
  }

  res401(res) {
    res.status(401).json({
      status: {
        code: 401,
        message: "Unauthorized Access!",
      },
      data: null,
    });
  }

  res404(message, res) {
    res.status(404).json({
      status: {
        code: 404,
        message,
      },
      data: null,
    });
  }

  res500(res) {
    res.status(500).json({
      status: {
        code: 500,
        message: "Server error!",
      },
      data: null,
    });
  }
}

export default ResponseHandler;

*/

/* custom_error.js
export class Error400 extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequest";
  }
}

export class Error404 extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFound";
  }
}

*/

// pada file ini userController.test.js buatkan aku unit test untuk controller userController.js dengan menggunakan jest dan mock function

// buatkan satu describe dengan nama UserController dan satu it dengan nama getAllUsers sebagai percobaan pertama

import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import UserController from "../userController.js";
import { UserService } from "../../services/userService.js";
import ResponseHandler from "../../utils/response.js";

describe("UserController", () => {
  let userController;
  let mockUserService;
  let mockResponseHandler;

  beforeEach(() => {
    // Mock dependencies
    mockUserService = {
      getAllUsers: jest.fn(),
    };

    mockResponseHandler = {
      res200: jest.fn(),
      res400: jest.fn(),
      res500: jest.fn(),
    };

    // Create controller instance with mocked dependencies
    userController = new UserController();
    userController.userService = mockUserService;
    userController.response = mockResponseHandler;
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: 1,
          name: "User 1",
          email: "royhan@gmail.com",
          profile: {
            identity_type: "KTP",
            identity_number: "1234567890",
            address: "Jl. Raya",
          },
        },
        {
          id: 2,
          name: "User 2",
          email: "fadhli@gmail.com",
          profile: {
            identity_type: "SIM",
            identity_number: "0987654321",
            address: "Jl. Mawar",
          },
        },
      ];

      mockUserService.getAllUsers.mockResolvedValue(users);

      // Mock `res` object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the function
      await userController.getAllUsers({}, res);

      // Assertions
      expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(mockResponseHandler.res200).toHaveBeenCalledWith("Success", users, res);
    });
  });
});
