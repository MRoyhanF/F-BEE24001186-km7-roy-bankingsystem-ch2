import "dotenv/config";
import http from "http";
import app from "./server/app.js";
import listEndpoints from "express-list-endpoints";
// import * as Sentry from "@sentry/node";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const start = async () => {
  try {
    console.log("=====================================================");
    listEndpoints(app).forEach((route) => {
      route.methods.forEach((method) => {
        console.log(`[ROUTE] : ${method} ${route.path}`);
      });
    });
    console.log("=====================================================");
    server.listen(PORT, () => {
      console.log(`🚀 [SERVER] is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`⚠️ [ERROR], ${error}`);
    // Sentry.captureException(error); // Mengirim error ke Sentry jika ada masalah di startup
  }
};

start();
