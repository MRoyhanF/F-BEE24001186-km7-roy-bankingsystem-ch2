import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { handleError } from "./middlewares/errorHandler.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// API Routes
app.use("/api/users", userRoutes);
// app.use("/api/account", accountRoutes);
// app.use("/api/posts", postRoutes);

// Routes Not Found
app.use(handleError);

export default app;
