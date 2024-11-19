import "dotenv/config";
import http from "http";
import app from "./server/app.js";
import { Server as SocketIOServer } from "socket.io";
import listEndpoints from "express-list-endpoints";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
export const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  const total = io.engine.clientsCount;
  console.log(`${total} user connected`);
  // register
  socket.on("register", (msg) => {
    const responseMessage = `Welcome ${msg} with email...`;
    io.emit("register", responseMessage);
    // io.emit("register", msg);
    // console.log(`pesan: ${msg}`);
  });
  //  change password
  socket.on("changePassword", (msg) => {
    const responseMessage = `Password ${msg} Changges...`;
    io.emit("changePassword", responseMessage);
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`${total} user disconnected`);
  });
});

// Start the server
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
  }
};

start();
