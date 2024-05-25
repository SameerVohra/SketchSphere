import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedUser extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as DecodedUser;
    if (!decoded || !decoded.id) {
      return res.status(400).send("Invalid Token");
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default verifyToken;
