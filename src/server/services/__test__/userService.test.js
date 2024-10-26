import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

const { UserService } = await import("../userService");

describe("UserService", () => {
  describe("getAccoutById", () => {
    it("should return a user by id", async () => {
      const result = await UserService.getUserById(1);

      expect(result).toEqual({ id: 1, name: "John Doe" });
    });
  });
});
