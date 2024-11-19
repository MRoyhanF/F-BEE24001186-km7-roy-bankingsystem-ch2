import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import ResponseHandler from "../response";

describe("ResponseHandler", () => {
  let responseHandler;
  let resMock;

  beforeEach(() => {
    responseHandler = new ResponseHandler();
    resMock = {
      status: jest.fn(() => resMock),
      json: jest.fn(),
    };
  });

  it("should return 200 status", () => {
    responseHandler.res200("Success", { data: "data" }, resMock);
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      status: {
        code: 200,
        message: "Success",
      },
      data: { data: "data" },
    });
  });

  it("should return 201 status", () => {
    responseHandler.res201("Created", { data: "data" }, resMock);
    expect(resMock.status).toHaveBeenCalledWith(201);
    expect(resMock.json).toHaveBeenCalledWith({
      status: {
        code: 201,
        message: "Created",
      },
      data: { data: "data" },
    });
  });

  it("should return 400 status", () => {
    responseHandler.res400("Bad Request", resMock);
    expect(resMock.status).toHaveBeenCalledWith(400);
    expect(resMock.json).toHaveBeenCalledWith({
      status: {
        code: 400,
        message: "Bad Request! - Bad Request",
      },
      data: null,
    });
  });

  it("should return 401 status", () => {
    responseHandler.res401(resMock);
    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.json).toHaveBeenCalledWith({
      status: {
        code: 401,
        message: "Unauthorized Access!",
      },
      data: null,
    });
  });

  it("should return 404 status", () => {
    responseHandler.res404("Not Found", resMock);
    expect(resMock.status).toHaveBeenCalledWith(404);
    expect(resMock.json).toHaveBeenCalledWith({
      status: {
        code: 404,
        message: "Not Found",
      },
      data: null,
    });
  });

  it("should return 500 status", () => {
    responseHandler.res500(resMock);
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      status: {
        code: 500,
        message: "Server error!",
      },
      data: null,
    });
  });
});
