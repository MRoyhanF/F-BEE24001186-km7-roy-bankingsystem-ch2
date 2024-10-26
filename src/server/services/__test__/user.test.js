import { UserService } from "../userService.js";
import prisma from "../../config/database.js";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../config/database.js", () => ({
  users: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  //   profiles: {
  //     findFirst: jest.fn(),
  //     update: jest.fn(),
  //   },
}));

describe("UserService", () => {
  let userService;

  beforeAll(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users with their profiles", async () => {
      const mockUsers = [
        {
          id: 2,
          name: "Eladio",
          email: "Jessyca80@gmail.com",
          password: "sOcWrjMDEe67dG6",
          profile: [
            {
              id: 2,
              identity_type: "SIM",
              identity_number: "508841673",
              address: "936 Church View Suite 306",
              user_id: 2,
            },
          ],
        },
      ];
      prisma.users.findMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      // expect(prismaMock.users.findMany).toHaveBeenCalledWith({ include: { profile: true } });
      expect(result).toEqual(mockUsers);
      //   expect(prisma.users.findMany).toHaveBeenCalledTimes(1);
    });

    // it("should return empty array if no user found", async () => {
    //   prisma.users.findMany.mockResolvedValue([]);

    //   const result = await userService.getAllUsers();

    //   expect(result).toEqual([]);
    //   expect(prisma.users.findMany).toHaveBeenCalledTimes(1);
    // });
  });

  describe("getUserById", () => {
    it("should return a user with their profile", async () => {
      const user = {
        id: 1,
        name: "John ",
        email: "Cole87@gmail.com",
        password: "newPassword",
        profile: [
          {
            id: 1,
            identity_type: "KTP",
            identity_number: "654321dhi93h2edsk39",
            address: "7014 Connelly Forest Apt. 678",
            user_id: 1,
          },
        ],
      };

      prisma.users.findUnique.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(result).toEqual(user);
    });
  });
});
