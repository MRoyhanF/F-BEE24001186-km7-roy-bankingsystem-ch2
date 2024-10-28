import { ErrorHandler, handleError } from "../errorHandler";

describe("errorHandler", () => {
  it("should return error message and status code", () => {
    const err = new ErrorHandler(404, "Not Found");
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    handleError(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      statusCode: 404,
      message: "Not Found",
    });
  });

  it("should return error message and status code with default value", () => {
    const err = new ErrorHandler();
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    handleError(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error",
    });
  });
});
