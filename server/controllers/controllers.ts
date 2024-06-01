import { Request, Response } from "express";
import User from "../models/userModel";
import Project from "../models/projectModel";
import { v4 as uuid } from "uuid";
import GenerateKey from "./randomKeysGenerator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
        projects: [],
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
      user.projects.push(projectName);
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
    }
    if (!project) {
      res.status(404).send("No such project");
      return;
    } else if (project.projectKey !== projectKey) {
      res.status(401).send("Wrong Project key");
      return;
    } else if (
      project.usersJoined.includes(user?.username) &&
      project.userId === user?.uId
    ) {
      res.status(409).send("User already joined");
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
