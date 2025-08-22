import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  refresh,
  register,
  resetPassword,
} from "../controller";

export const AuthRouter = Router();

AuthRouter.get("/me", getMe);

// Register new account
AuthRouter.post("/register", register);

// Login and get access + refresh token
AuthRouter.post("/login", login);

// Refresh access token
AuthRouter.post("/refresh", refresh);

// Logout (invalidate refresh token)
AuthRouter.post("/logout", logout);

// Forgot password (send reset link)
AuthRouter.post("/forgot-password", forgotPassword);

// Reset password (after clicking email link)
AuthRouter.post("/reset-password", resetPassword);

// Change password (while logged in)
AuthRouter.post("/change-password", changePassword);
