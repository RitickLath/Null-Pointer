import jwt from "jsonwebtoken";
import crypto from "crypto";

// Short Loved Token
export const getAccessToken = (username: string, id: string) => {
  const payload = { username, id };
  const secretKey = process.env.SECRET || "Ritick";

  const AccessToken = jwt.sign(payload, secretKey, { expiresIn: "5h" });

  return AccessToken;
};

// Long Lived Token
export const getRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};
