import "dotenv/config";
import http from "http";
import app from "./server/server.js";
import listEndpoints from "express-list-endpoints";

const port = process.env.PORT || 3000;
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
  } catch (error) {
    console.log(`⚠️ [ERROR], ${error}`);
  }
};

start();
