import ResponseHandler from "../utils/response.js";
import { Error400 } from "../utils/custom_error.js";

class ErrorHandler {
  static handle404(req, res) {
    const responseHandler = new ResponseHandler();
    responseHandler.res404("URL Not Found!", res);
  }

  static handleError(err, req, res, next) {
    if (err) {
      if (err instanceof Error400) {
        const responseHandler = new ResponseHandler();
        console.log("Client error: " + err.message);
        responseHandler.res400(err.message, res);
      } else {
        const responseHandler = new ResponseHandler();
        console.log("Server error: " + err.message);
        responseHandler.res500(res);
      }
    } else {
      next();
    }
  }
}

export default ErrorHandler;
