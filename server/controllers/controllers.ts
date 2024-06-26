import { Request, Response } from "express";
import User from "../models/userModel";
import Project from "../models/projectModel";
import { v4 as uuid } from "uuid";
import GenerateKey from "./randomKeysGenerator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CanvasModel from "../models/canvasModel";
dotenv.config();

export const Login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res.status(401).send("All fields are required");
      return;
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(401).send("Wrong username/password");
      return;
    } else {
      if (!bcrypt.compare(password, user.password)) {
        res.status(403).send("Wrong username/password");
        return;
      } else {
        const payLoad = {
          id: user.uId,
        };
        if (!process.env.SECRET_KEY) {
          throw new Error("Secret key not defined");
        }
        console.log(`Secret Key2: ${process.env.SECRET_KEY}`);
        const token: string = jwt.sign(
          payLoad,
          process.env.SECRET_KEY as string,
        );
        console.log(`Login Token: ${token}`);
        res.status(201).send({ token, id: user.uId });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const Register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, mobile, password } = req.body;
  try {
    if (!username || !email || !mobile || !password) {
      res.status(401).send("All values required");
      return;
    } else {
      const uname = await User.findOne({ username });
      const uemail = await User.findOne({ email });

      if (uname || uemail) {
        res.status(401).send("Username/Email already exists");
        return;
      }
      const user = new User({
        uId: uuid(),
        username: username,
        email: email,
        mobile: mobile,
        password: bcrypt.hashSync(password),
        projects: [{}],
      });

      await user.save();
      res.status(201).send("Registered");
    }
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const MakeProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const uId = req.params;
  const { projectName } = req.body;
  try {
    const userId: string = uId.id;
    const key: string = GenerateKey.genKey();
    const user = await User.findOne({ uId: userId });
    if (!user) {
      res.status(404).send("No user with this username/email");
      return;
    } else {
      if (user.projects.includes(projectName)) {
        res.status(409).send("Project with same name exists");
        return;
      }
      const projectId: string = GenerateKey.genProjId();
      const project = new Project({
        projectId: projectId,
        projectKey: key,
        userId: userId,
        projectName: projectName,
        username: user.username,
        numberOfUsers: 0,
      });
      user.projects.push({ projectName: projectName, projectId: projectId });
      console.log(user.projects);
      await user.save();
      await project.save();
      res.status(201).json({ project });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const JoinProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectKey, projectId } = req.body;
  const { userId } = req.params;
  try {
    const project = await Project.findOne({ projectId });
    const user = await User.findOne({ userId });
    if (!user) {
      res.status(401).send("Login to continue");
      return;
    } else if (!project) {
      res.status(404).send("No such project");
      return;
    } else if (project.projectKey !== projectKey) {
      res.status(401).send("Wrong Project key");
      return;
    }
    project.numberOfUsers += 1;
    project.usersJoined.push(user?.username);
    await project.save();
    res.status(201).send("Joined Successfully");
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const userDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const uId = req.params;
  console.log(uId.id);
  try {
    const id: string = uId.id;
    const user = await User.findOne({ uId: id });
    if (!user) {
      res.status(404).send("Invalid user");
      return;
    }
    res.status(201).json({ user });
  } catch (error) {
    res.status(501).send("Internal Server Error");
    console.log(error);
  }
};

export const projectDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uId } = req.body;
  console.log(uId);
  try {
    const projects = await Project.find({ userId: uId });
    console.log(projects);
    res.status(201).send(projects);
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const saveDrawing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectId, drawing } = req.body;
  try {
    const project = await Project.findOne({ projectId: projectId });
    const canvasData = await CanvasModel.findOne({ projectId: projectId });
    if (!canvasData) {
      console.log(project);
      const newDrawing = new CanvasModel({
        drawData: drawing,
        projectId: projectId,
        projectName: project?.projectName,
      });
      await newDrawing.save();
      res.status(201).send("saved Successfully");
    } else {
      const newData = await CanvasModel.findOneAndUpdate(
        { projectId: projectId },
        { drawData: drawing },
      );
      await newData!.save();
      res.status(201).send("saved successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const loadCanvas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectId } = req.body;
  try {
    const project = await CanvasModel.findOne({ projectId: projectId });
    if (!project) {
      res.status(404).send("Error fetching project data");
      return;
    }

    console.log(project);
    res.status(201).send(project.drawData);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
};
