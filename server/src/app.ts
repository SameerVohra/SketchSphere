import express from "express";
import {
  JoinProject,
  Login,
  MakeProject,
  Register,
} from "../controllers/controllers";
import cors from "cors";
import verifyToken from "../middlewares/verifyToken";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.post("/login", Login);
app.post("/register", Register);
app.post("/:id/new-project", verifyToken, MakeProject);
app.post("/:id/join-project", verifyToken, JoinProject);

export default app;
