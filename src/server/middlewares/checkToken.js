// import jwt from "jsonwebtoken";
// // import { ErrorHandler } from "../middlewares/errorHandler.js";

// // import ResponseHandler from "../utils/response.js";
// import { Error400, Error404 } from "../utils/custom_error.js";
// import { isTokenLoggedOut } from "../utils/tokenStore.js";

// export const checkToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   console.log(token);

//   // if (!token) return res.status(401).json({ message: "No token provided" });
//   // if (!token) return next(Error400("No token provided"));
//   if (!token) return Error400("No token provided");

//   if (isTokenLoggedOut(token)) {
//     // return res.status(401).json({ message: "Token is logged out" });
//     return next(Error400("Token is logged out"));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     // next(new ErrorHandler(error.statusCode || 401, error.message));
//     if (error instanceof Error400) {
//       return this.response.res400(error.message, res);
//     } else if (error instanceof Error404) {
//       return this.response.res404(error.message, res);
//     } else {
//       console.log(error.message);
//       return this.response.res500(res);
//     }
//   }
// };

import jwt from "jsonwebtoken";
import ResponseHandler from "../utils/response.js";
import { isTokenLoggedOut } from "../utils/tokenStore.js";

const response = new ResponseHandler();

export const checkToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return response.res401("Unauthorized", res);
  }

  if (isTokenLoggedOut(token)) {
    console.log("Token is logged out");
    return response.res401(res);
  }

  console.log("JTW Secret:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const payload = {
      id: decoded.id,
      name: decoded.name,
    };
    req.user = payload;
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error.message);
    return response.res500(res);
  }
};
