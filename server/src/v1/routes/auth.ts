import express from "express";
import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { validate } from "../middleware/validation";
import { register, login } from "../controllers/user";
import { verifyToken } from "../middleware/token";

const router = express.Router();

// ユーザー新規登録API
router.post(
  "/register",
  body("username").isLength({ min: 8 }).withMessage("username8文字以上必須"),
  body("password").isLength({ min: 8 }).withMessage("password8文字以上必須"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用password8文字以上必須"),
  body("username").custom((value: string) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このゆーざーは既に使われています。");
      }
    });
  }),
  (req: Request, res: Response, next: NextFunction) => {
    validate(req, res, next);
  },
  (req: Request, res: Response) => {
    register(req, res);
  }
);

//  ログインAPI
router.post(
  "/login",
  body("username").isLength({ min: 8 }).withMessage("username8文字以上必須"),
  body("password").isLength({ min: 8 }).withMessage("password8文字以上必須"),
  (req: Request, res: Response, next: NextFunction) => {
    validate(req, res, next);
  },
  (req: Request, res: Response) => {
    login(req, res);
  }
);

router.post(
  "/verify-token",
  (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next);
  },
  (req: Request, res: Response) => {
    return res.status(200).json({ user: req.body.user });
  }
);

export default router;
