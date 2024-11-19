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

  describe("error 400", () => {
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
  });
  describe("error 404", () => {
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
  });
});
