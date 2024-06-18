import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import app from "./app"; // Import the app instance

dotenv.config();

const port: number = parseInt(process.env.PORT || "3000");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

mongoose
  .connect(process.env.DB_URI!)
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  socket.on("leaveProject", (projectId) => {
    socket.leave(projectId);
    console.log(`User ${socket.id} left project ${projectId}`);
  });

  socket.on("draw", (data) => {
    socket.to(data.projectId).emit("draw", data);
  });

  socket.on("clear", (projectId) => {
    io.to(projectId).emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
