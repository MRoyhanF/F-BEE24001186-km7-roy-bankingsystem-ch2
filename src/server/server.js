import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   session({
//     // store: new firestoreStore({
//     //     database: db
//     // }),
//     secret: process.env.SESSION_KEY,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 600000 * 24, //set to 24 hours
//     },
//   })
// );
// app.set("view engine", "ejs");
// app.set("views", viewsFolder);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes Not Found
// app.use(notFoundHandler);

export default app;
