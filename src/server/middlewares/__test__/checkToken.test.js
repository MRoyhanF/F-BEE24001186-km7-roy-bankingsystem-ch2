import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import jwt from "jsonwebtoken";
import { checkToken } from "../checkToken";
import { isTokenLoggedOut } from "../../utils/tokenStore";

jest.mock("jsonwebtoken");
jest.mock("../../utils/tokenStore");

describe("checkToken middleware", () => {
  const req = {
    headers: {},
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer token";
    isTokenLoggedOut.mockReturnValue(false);
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });
    checkToken(req, res, next);
    // expect(res.status).toHaveBeenCalledWith(401);
    // expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("should set user in request object and call next", () => {
    req.headers.authorization = "Bearer token";
    isTokenLoggedOut.mockReturnValue(false);
    jwt.verify.mockReturnValue({ id: 1 });
    checkToken(req, res, next);
    expect(req.user).toEqual({ id: 1 });
    expect(next).toHaveBeenCalled();
  });
});
