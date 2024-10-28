// import jwt from "jsonwebtoken";
// import { isTokenLoggedOut } from "../utils/tokenStore.js";

// export const checkToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   if (isTokenLoggedOut(token)) {
//     return res.status(401).json({ message: "Token is logged out" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// unit tests for the checkToken middleware function using a mock function

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

  it("should return 401 if no token provided", () => {
    checkToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
  });

  it("should return 401 if token is logged out", () => {
    req.headers.authorization = "Bearer token";
    isTokenLoggedOut.mockReturnValue(true);
    checkToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({ message: "Token is logged out" });
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer token";
    isTokenLoggedOut.mockReturnValue(false);
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });
    checkToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
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
