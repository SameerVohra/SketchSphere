import express from "express";
import {
  JoinProject,
  Login,
  MakeProject,
  Register,
  loadCanvas,
  projectDetails,
  saveDrawing,
  userDetails,
} from "../controllers/controllers";
import cors from "cors";
import verifyToken from "../middlewares/verifyToken";

const app = express();

const corsOptions = {
  origin: [
    "https://sketch-sphere.vercel.app",
    "https://sketchsphere.vercel.app",
  ], // Add all necessary origins here
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.post("/login", Login);
app.post("/register", Register);
app.post("/:id/new-project", verifyToken, MakeProject);
app.post("/:id/join-project", verifyToken, JoinProject);
app.get("/user-details/:id", verifyToken, userDetails);
app.post("/project-details", verifyToken, projectDetails);
app.post("/save-canvas", saveDrawing);
app.post("/load-canvas", loadCanvas);

export default app;
