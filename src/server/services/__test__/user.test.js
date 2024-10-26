import { PrismaClient } from "@prisma/client";
import { UserService } from "../userService";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    profiles: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new instance of PrismaClient", () => {
    expect(PrismaClient).toHaveBeenCalledTimes(1);
  });

  describe("getAllUsers", () => {
    it("should return all users with their profiles", async () => {
      const users = [
        {
          id: 1,
          email: "joko@gmail.com",
          profile: {
            id: 1,
            bio: "Hello, I'm Joko",
          },
        },
        {
          id: 2,
          email: "jokowi@gmail.com",
          profile: {
            id: 2,
            bio: "Hello, I'm Jokowi",
          },
        },
      ];

      userService.prisma.users.findMany.mockResolvedValue(users);
      const result = await userService.getAllUsers();

      expect(result).toEqual(users);
      expect(userService.prisma.users.findMany).toHaveBeenCalledTimes(1);
      expect(userService.prisma.users.findMany).toHaveBeenCalledWith({ include: { profile: true } });
    });
  });

  describe("getUserById", () => {
    it("should return a user by id with their profile", async () => {
      const user = {
        id: 1,
        email: "jokowi@gmail.com",
        profile: {
          id: 1,
          bio: "Hello, I'm Jokowi",
        },
      };
      userService.prisma.users.findUnique.mockResolvedValue(user);
      const result = await userService.getUserById(1);
      expect(result).toEqual(user);
      expect(userService.prisma.users.findUnique).toHaveBeenCalledTimes(1);
      expect(userService.prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { profile: true },
      });
    });
  });

  describe("getUserByEmail", () => {
    it("should return a user by email", async () => {
      const user = {
        id: 1,
        email: "joko@gmail.com",
        profile: {
          id: 1,
          bio: "Hello, I'm Joko",
        },
      };
      userService.prisma.users.findUnique.mockResolvedValue(user);
      const result = await userService.getUserByEmail("joko@gmail.com");
      expect(result).toEqual(user);
      expect(userService.prisma.users.findUnique).toHaveBeenCalledTimes(1);
      expect(userService.prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: "joko@gmail.com" },
      });
    });
  });

  describe("createUser", () => {
    it("should create a new user with their profile", async () => {
      const data = {
        email: "budi@gmail.com",
        profile: {
          bio: "Hello, I'm Budi",
        },
      };
      const user = {
        id: 1,
        email: "budi@gmail.com",
        profile: {
          id: 1,
          bio: "Hello, I'm Budi",
        },
      };
      userService.prisma.users.create.mockResolvedValue(user);
      const result = await userService.createUser(data);
      expect(result).toEqual(user);
      expect(userService.prisma.users.create).toHaveBeenCalledTimes(1);
      expect(userService.prisma.users.create).toHaveBeenCalledWith({
        data: {
          email: "budi@gmail.com",
          profile: {
            create: {
              bio: "Hello, I'm Budi",
            },
          },
        },
        include: { profile: true },
      });
    });
  });

  describe("updateUser", () => {
    it("should update a user by id with their profile", async () => {
      const data = {
        email: "adit@gmail.com",
        profile: {
          bio: "Hello, I'm Adit",
        },
      };
      const user = {
        id: 1,
        email: "adit@gmail.com",
        profile: {
          id: 1,
          bio: "Hello, I'm Adit",
        },
      };
      userService.prisma.users.update.mockResolvedValue(user);
      userService.prisma.profiles.findFirst.mockResolvedValue({ id: 1 });
      const result = await userService.updateUser(1, data);
      expect(result).toEqual(user);
      expect(userService.prisma.users.update).toHaveBeenCalledTimes(1);
      expect(userService.prisma.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { email: "adit@gmail.com" },
        include: { profile: true },
      });
      expect(userService.prisma.profiles.findFirst).toHaveBeenCalledTimes(1);
      expect(userService.prisma.profiles.findFirst).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });

    it("should thorw an error if profile not found", async () => {
      const data = {
        email: "woy@gmail.com",
        profile: {
          bio: "Hello, I'm Woy",
        },
      };
      userService.prisma.profiles.findFirst.mockResolvedValue(null);
      await expect(userService.updateUser(1, data)).rejects.toThrow("Profile not found");
      expect(userService.prisma.profiles.findFirst).toHaveBeenCalledTimes(1);
      expect(userService.prisma.profiles.findFirst).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });
  });
});
