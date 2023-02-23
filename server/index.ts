import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { config } from "./src/v1/config";
import router from "./src/v1/routes/auth";

const PORT = 5000;
const app = express();
app.use(express.json());
app.use("/api/v1", router);

// DB接続
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(config.mongooseUrl);
  console.log("接続中");
} catch (error) {
  console.error(error);
}

// ユーザーログインAPI
app.listen(PORT, () => {
  console.log("さーばーきどうちゅう");
});
