export const config = {
  mongooseUrl: process.env.MONGODO_URL || "",
  secretKey: process.env.SECRET_KEY || "",
  tokenSecretKey: process.env.TOKEN_SECRET_KEY || "",
};
