const express = require("express");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("./src/v1/models/user");
const app = express();
const PORT = 5000;
require("dotenv").config();
app.use(express.json());

// DB接続
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGODO_URL);
  console.log("接続中");
} catch (error) {
  console.error(error);
}

// ユーザー新規登録API
app.post(
  "/register",
  body("username").isLength({ min: 8 }).withMessage("username8文字以上必須"),
  body("password").isLength({ min: 8 }).withMessage("password8文字以上必須"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用password8文字以上必須"),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このゆーざーは既に使われています。");
      }
    });
  }),
  async (req, res) => {
    // passwordの取得
    const password = req.body.password;
    try {
      // passwordの暗号化
      req.body.password = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      );
      // userの新規登録
      const user = await User.create(req.body);

      // JWTの発行
      const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "24h",
      });

      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

// ユーザーログインAPI

app.listen(PORT, () => {
  console.log("さーばーきどうちゅう");
});
