// JWT認証を検証
import { Request, Response, NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { User } from "../models/user";

const tokenDecode = (req: Request) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader?.split(" ")[1];

    try {
      const decodedToken = JWT.verify(bearer, config.tokenSecretKey);
      return decodedToken;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

type TJWTPayloadEx = {
  id: string;
} & JwtPayload;

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenDecoded = tokenDecode(req) as TJWTPayloadEx;
  if (tokenDecoded) {
    // 一致するユーザーを探す
    const user = await User.findById(tokenDecoded.id);
    if (!user) {
      return res.status(401).json("権限がありません");
    }
    req.body.user = user;
    next();
  } else {
    return res.status(401).json("権限がありません");
  }
};
