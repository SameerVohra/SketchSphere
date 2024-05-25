import { Request, Response } from "express";
import User from "../models/userModel";
import Project from "../models/projectModel";
import { v4 as uuid } from "uuid";
import GenerateKey from "./randomKeysGenerator";
import bcrypt from "bcryptjs";

export const Login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res.status(401).send("All fields are required");
      return;
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(401).send("No such user");
      return;
    } else {
      const hashedPass = bcrypt.hashSync(password);

      if (!bcrypt.compare(password, user.password)) {
        res.status(403).send("Wrong Password");
        return;
      }
      res.status(201).send("Logged In");
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
};

export const Register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, mobile, password } = req.body;
  try {
    if (!username || !email || !mobile || !password) {
      res.send("All values required");
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
      });

      await user.save();
      res.status(201).send("Registered");
    }
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};

export const MakeProject = async (req: Request, res: Response) => {
  const uId = req.params;
  const { projectName } = req.body;
  try {
    console.log(uId.id);
    const userId: string = uId.id;
    const key: string = GenerateKey.genKey();
    const user = await User.findOne({ uId: userId });
    if (!user) {
      res.status(404).send("No user with this username/email");
      return;
    } else {
      const projectId: string = GenerateKey.genProjId();
      const project = new Project({
        projectId: projectId,
        projectKey: key,
        userId: userId,
        projectName: projectName,
        username: user.username,
        numberOfUsers: 1,
      });

      await project.save();
      res.status(201).json({ project });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
};
