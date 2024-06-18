import { Server } from "socket.io";
import http from "http";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://sketchsphere.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

mongoose
  .connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
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

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
