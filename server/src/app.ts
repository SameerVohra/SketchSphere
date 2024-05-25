import express from "express";
import { Login, MakeProject, Register } from "../controllers/controllers";

const app = express();

app.use(express.json());
app.post("/login", Login);
app.post("/register", Register);
app.post("/:id/new-project", MakeProject);

export default app;
