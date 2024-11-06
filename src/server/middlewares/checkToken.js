import jwt from "jsonwebtoken";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { isTokenLoggedOut } from "../utils/tokenStore.js";

export const checkToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  if (isTokenLoggedOut(token)) {
    return res.status(401).json({ message: "Token is logged out" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ErrorHandler(error.statusCode || 401, error.message));
  }
};
