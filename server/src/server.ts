import mongoose from "mongoose";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import verifyToken from "../middlewares/verifyToken";
import app from "./app";
import cors from "cors";

dotenv.config();

const port: number = parseInt(process.env.PORT || "3000");

mongoose
  .connect(process.env.DB_URI!)
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

app.use(cors({ origin: "*" }));

app.get("/test", (req: Request, res: Response) => {
  res.send("Testing");
});

app.get("/verify", verifyToken, (req: Request, res: Response) => {
  res.send("verified");
});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
