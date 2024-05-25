import { Router } from "express";
import { Login, MakeProject, Register } from "../controllers/controllers";

const router = Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/:id/new-project", MakeProject);
