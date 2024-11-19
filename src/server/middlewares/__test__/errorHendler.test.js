import { jest, describe, it, expect } from "@jest/globals";
import ErrorHandler from "../errorHandler.js";
import { Error400 } from "../../utils/custom_error.js";

describe("Error Handler", () => {
  it("should return 404 response", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    ErrorHandler.handle404(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: {
        code: 404,
        message: "URL Not Found!",
      },
      data: null,
    });
  });

  it("should return 400 response", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const err = new Error400("Bad Request!");

    ErrorHandler.handleError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: {
        code: 400,
        message: "Bad Request! - Bad Request!",
      },
      data: null,
    });
  });

  it("should return 500 response", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const err = new Error("Internal Server Error");

    ErrorHandler.handleError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: {
        code: 500,
        message: "Server error!",
      },
      data: null,
    });
  });

  it("should call next", () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    ErrorHandler.handleError(null, req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
