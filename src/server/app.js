import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// API Routes
// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Web Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes Not Found
// app.use(notFoundHandler);

export default app;
