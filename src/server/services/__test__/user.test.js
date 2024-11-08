import { jest, describe, it, expect, beforeAll, afterEach, afterAll } from "@jest/globals";
import { UserService } from "../userService";
import ImageKit from "imagekit";

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindFirst = jest.fn();

jest.mock("imagekit");
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        users: {
          findMany: mockFindMany,
          findUnique: mockFindUnique,
          create: mockCreate,
          update: mockUpdate,
        },
        profiles: {
          findFirst: mockFindFirst,
          update: jest.fn(),
        },
      };
    }),
  };
});

describe("UserService", () => {
  let userService;

  beforeAll(() => {
    userService = new UserService();
    jest.spyOn(userService, "deleteImageFromImageKit").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: 1,
          email: "roy@gmail.com",
          foto: "https://imagekit.io/roy.jpg",
          profile: {
            id: 1,
            user_id: 1,
            bio: "Hello World",
          },
        },
      ];

      mockFindMany.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(result).toEqual(users);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserById", () => {
    it("should return user by id", async () => {
      const user = {
        id: 1,
        email: "roy@gmail.com",
        foto: "https://imagekit.io/roy.jpg",
        profile: {
          id: 1,
          user_id: 1,
          bio: "Hello World",
        },
      };

      mockFindUnique.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(result).toEqual(user);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { profile: true } });
    });

    // it("should throw error if user not found", async () => {
    //   mockFindUnique.mockResolvedValue(null);

    //   await expect(userService.getUserById(999)).rejects.toThrow("User not found");
    // });
  });

  describe("getUserByEmail", () => {
    it("should return user by email", async () => {
      const user = {
        id: 1,
        email: "roy@gmail.com",
        foto: "https://imagekit.io/roy.jpg",
      };

      mockFindUnique.mockResolvedValue(user);

      const result = await userService.getUserByEmail("roy@gmail.com");

      expect(result).toEqual(user);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { email: "roy@gmail.com" } });
    });
  });

  describe("uploadImageToImageKit", () => {
    it("should upload image and return URL", async () => {
      const file = {
        originalname: "test.jpg",
        buffer: Buffer.from("image data"),
      };

      const expectedUrl = "https://imagekit.io/roy.jpg";

      ImageKit.prototype.upload.mockResolvedValue({ url: expectedUrl });

      const result = await userService.uploadImageToImageKit(file);

      expect(result).toBe(expectedUrl);
      expect(ImageKit.prototype.upload).toHaveBeenCalledWith({
        file: file.buffer,
        fileName: expect.stringContaining("test.jpg"),
        folder: "/photo",
      });
    });

    it("should throw error if upload fails", async () => {
      const file = {
        originalname: "test.jpg",
        buffer: Buffer.from("image data"),
      };

      ImageKit.prototype.upload.mockRejectedValue(new Error("Upload failed"));

      await expect(userService.uploadImageToImageKit(file)).rejects.toThrow("Image upload failed: Upload failed");
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const data = {
        email: "roy@gmail.com",
        password: "password123",
        profile: { bio: "Hello World" },
      };
      const imageUrl = "https://imagekit.io/roy.jpg";

      const newUser = {
        id: 1,
        ...data,
        foto: imageUrl,
        profile: {
          id: 1,
          user_id: 1,
          bio: "Hello World",
        },
      };

      mockCreate.mockResolvedValue(newUser);

      const result = await userService.createUser(data, imageUrl);

      expect(result).toEqual(newUser);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          ...data,
          foto: imageUrl,
          profile: { create: data.profile },
        },
        include: { profile: true },
      });
    });
  });

  describe("updateUser", () => {
    it("should update user", async () => {
      const userId = 1;
      const userData = { email: "roy@gmail.com" };

      const existingUser = {
        id: userId,
        email: "newroy@gmail.com",
        foto: "https://imagekit.io/roy.jpg",
        profile: {
          id: 1,
          user_id: userId,
          bio: "Hello World",
        },
      };

      mockFindUnique.mockResolvedValue(existingUser);
      mockUpdate.mockResolvedValue({ ...existingUser, ...userData });

      const result = await userService.updateUser(userId, userData);

      expect(result).toEqual({ ...existingUser, ...userData });
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: userId }, include: { profile: true } });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: userId },
        data: { ...userData, foto: existingUser.foto },
        include: { profile: true },
      });
    });

    it("should throw error if user not found during update", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(userService.updateUser(999, {})).rejects.toThrow("User not found");
    });

    // if (foto && existingUser.foto) {
    //   await this.deleteImageFromImageKit(existingUser.foto);
    // }
    // hendle this condition in test case
    it("should delete existing image if new image is uploaded", async () => {
      const userId = 1;
      const userData = { email: "roy@gmail.com", foto: "https://imagekit.io/newroy.jpg" };

      const existingUser = {
        id: userId,
        email: "newroy@gmail.com",
        foto: "https://imagekit.io/roy.jpg",
        profile: {
          id: 1,
          user_id: userId,
          bio: "Hello World",
        },
      };

      mockFindUnique.mockResolvedValue(existingUser);
      mockUpdate.mockResolvedValue({ ...existingUser, ...userData });

      await userService.updateUser(userId, userData);

      expect(userService.deleteImageFromImageKit).toHaveBeenCalledWith(existingUser.foto);
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      const userId = 1;
      const profileData = { bio: "Hello World" };

      const existingProfile = {
        id: 1,
        user_id: userId,
        bio: "Hello World",
      };

      mockFindFirst.mockResolvedValue(existingProfile);

      await userService.updateProfile(userId, profileData);

      expect(mockFindFirst).toHaveBeenCalledWith({ where: { user_id: userId } });
    });

    it("should throw error if profile not found", async () => {
      mockFindFirst.mockResolvedValue(null);

      await expect(userService.updateProfile(999, {})).rejects.toThrow("Profile not found");
    });

    it("should update profile if profile data is provided", async () => {
      const userId = 1;
      const profileData = { bio: "Hello World" };

      const existingProfile = {
        id: 1,
        user_id: userId,
        bio: "Hello World",
      };

      mockFindFirst.mockResolvedValue(existingProfile);

      jest.spyOn(userService, "updateProfile").mockImplementation(jest.fn());

      await userService.updateUser(userId, { profile: profileData });

      expect(userService.updateProfile).toHaveBeenCalledWith(userId, profileData);
    });
  });

  describe("deleteImageFromImageKit", () => {
    it("should not delete image if URL is not provided", async () => {
      await userService.deleteImageFromImageKit(null);

      expect(userService.imagekit.deleteFile).not.toHaveBeenCalled();
    });

    it("should not delete image if URL is not provided", async () => {
      await userService.deleteImageFromImageKit(null);

      expect(userService.imagekit.deleteFile).not.toHaveBeenCalled();
    });
  });
});
