import { PrismaClient } from "@prisma/client";
import { AccountService } from "../accountSevice";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    bank_accounts: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe("AccountService", () => {
  let accountService;

  beforeEach(() => {
    accountService = new AccountService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new instance of PrismaClient", () => {
    expect(PrismaClient).toHaveBeenCalledTimes(1);
  });

  describe("getAllAccount", () => {
    it("should return all accounts with their users", async () => {
      const accounts = [
        {
          id: 1,
          bank_name: "BCA",
          bank_account_number: "1234567890",
          balance: 1000000,
          user: {
            id: 1,
            email: "fadhli@gmail.com",
          },
        },
        {
          id: 2,
          bank_name: "BNI",
          bank_account_number: "0987654321",
          balance: 500000,
          user: {
            id: 2,
            email: "fadhli@gmial.com",
          },
        },
      ];

      accountService.prisma.bank_accounts.findMany.mockResolvedValue(accounts);
      const result = await accountService.getAllAccount();

      expect(result).toEqual(accounts);
      expect(accountService.prisma.bank_accounts.findMany).toHaveBeenCalledTimes(1);
      expect(accountService.prisma.bank_accounts.findMany).toHaveBeenCalledWith({ include: { user: true } });
    });
  });

  describe("getAccountById", () => {
    it("should return an account by id with their user", async () => {
      const account = {
        id: 1,
        bank_name: "BCA",
        bank_account_number: "1234567890",
        balance: 1000000,
        user: {
          id: 1,
          email: "roy@gmail.com",
        },
      };
      accountService.prisma.bank_accounts.findUnique.mockResolvedValue(account);
      const result = await accountService.getAccountById(1);
      expect(result).toEqual(account);
      expect(accountService.prisma.bank_accounts.findUnique).toHaveBeenCalledTimes(1);
      expect(accountService.prisma.bank_accounts.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true },
      });
    });
  });

  describe("getAccountByUser", () => {
    it("should return an account by user id", async () => {
      const account = {
        id: 1,
        bank_name: "BCA",
        bank_account_number: "1234567890",
        balance: 1000000,
        user: {
          id: 1,
          email: "roy@gmail.com",
        },
      };
      accountService.prisma.bank_accounts.findFirst.mockResolvedValue(account);
      const result = await accountService.getAccountByUser(1);
      expect(result).toEqual(account);
      expect(accountService.prisma.bank_accounts.findFirst).toHaveBeenCalledTimes(1);
      expect(accountService.prisma.bank_accounts.findFirst).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });
  });

  describe("createAccount", () => {
    it("should create a new account", async () => {
      const data = {
        bank_name: "BCA",
        bank_account_number: "1234567890",
        balance: 1000000,
        user_id: 1,
      };
      const account = {
        id: 1,
        bank_name: "BCA",
        bank_account_number: "1234567890",
        balance: 1000000,
        user: {
          id: 1,
          email: "roy@gmail.com",
        },
      };
      accountService.prisma.bank_accounts.create.mockResolvedValue(account);
      const result = await accountService.createAccount(data);
      expect(result).toEqual(account);
      expect(accountService.prisma.bank_accounts.create).toHaveBeenCalledTimes(1);
      expect(accountService.prisma.bank_accounts.create).toHaveBeenCalledWith({
        data: {
          bank_name: "BCA",
          bank_account_number: "1234567890",
          balance: 1000000,
          user: {
            connect: {
              id: 1,
            },
          },
        },
      });
    });
  });

  describe("updateAccount", () => {
    it("should update an account by id", async () => {
      const data = {
        bank_name: "BCA",
        bank_account_number: "1234567890",
        balance: 1000000,
      };
      const account = {
        id: 1,
        bank_name: "BCA",
        bank_account_number: "1234567890",
        balance: 1000000,
        user: {
          id: 1,
          email: "roy@gmail.com",
        },
      };
      accountService.prisma.bank_accounts.update.mockResolvedValue(account);
      const result = await accountService.updateAccount(1, data);
      expect(result).toEqual(account);
      expect(accountService.prisma.bank_accounts.update).toHaveBeenCalledTimes(1);
      expect(accountService.prisma.bank_accounts.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
    });
  });

  describe("deleteAccount", () => {
    it("should delete an account by id", async () => {
      accountService.prisma.bank_accounts.delete.mockResolvedValue({ id: 1 });
      const result = await accountService.deleteAccount(1);
      expect(result).toEqual({ id: 1 });
      expect(accountService.prisma.bank_accounts.delete).toHaveBeenCalledTimes(1);
      expect(accountService.prisma.bank_accounts.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
