import express from "express";
import cors from "cors";
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
import verifyToken from "../middlewares/verifyToken";

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
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
