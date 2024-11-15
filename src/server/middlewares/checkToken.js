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
