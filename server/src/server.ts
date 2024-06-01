import mongoose from "mongoose";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import verifyToken from "../middlewares/verifyToken";
import app from "./app"; // Ensure `app` is properly configured
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const port: number = parseInt(process.env.PORT || "3000");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.DB_URI!)
  .then((): void => {
    console.log("Connected to DB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

app.get("/test", (req: Request, res: Response): void => {
  res.send("Testing");
});

app.get("/verify", verifyToken, (req: Request, res: Response): void => {
  res.send("Verified");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("draw", (data) => {
    console.log("Draw event received:", data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("clear", () => {
    console.log("Clear event received");
    io.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, (): void => {
  console.log(`Listening on port: ${port}`);
});
