import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import JWT from "jsonwebtoken";
import { config } from "../config";
import { User } from "../models/user";

export const register = async (req: Request, res: Response) => {
  // passwordの取得
  const password = req.body?.password;
  try {
    // passwordの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, config.secretKey);
    // userの新規登録
    const user = await User.create(req.body);

    // JWTの発行
    const token = JWT.sign({ id: user._id }, config.tokenSecretKey, {
      expiresIn: "24h",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  // passwordの取得
  const { username, password } = req.body;
  try {
    // DBにユーザーが存在するかを探す
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(401).json({
        errors: {
          param: "username",
          message: "ユーザー名が無効です",
        },
      });
    }

    // パスワードの照合
    const descryptedPassword = CryptoJS.AES.decrypt(
      user?.password!,
      config.secretKey
    ).toString(CryptoJS.enc.Utf8);
    console.log(
      "descryptedPassword - ",
      descryptedPassword,
      "password - ",
      password
    );
    if (descryptedPassword !== password) {
      return res.status(401).json({
        errors: {
          param: "login",
          message: "ログインに失敗しました。",
        },
      });
    }
    // JWTの発行
    const token = JWT.sign({ id: username._id }, config.tokenSecretKey, {
      expiresIn: "24h",
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
