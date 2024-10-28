import jwt from "jsonwebtoken";
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
    return res.status(401).json({ message: "Invalid token" });
  }
};
