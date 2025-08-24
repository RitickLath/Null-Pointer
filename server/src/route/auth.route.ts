import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../controller";
import { isAuthenticated } from "../middleware";

export const AuthRouter = Router();

AuthRouter.get("/me", isAuthenticated, getMe);

// Register new account
AuthRouter.post("/register", register);

// Login and get access + refresh token
AuthRouter.post("/login", login);

// Logout (invalidate refresh token)
AuthRouter.post("/logout", isAuthenticated, logout);

// Forgot password (send reset link) (when not logged in: so send email)
AuthRouter.post("/forgot-password", forgotPassword);

// Reset password (after clicking email link)
AuthRouter.post("/reset-password/:id", resetPassword);

// Change password (while logged in) (by providing old password only: no mail sent.)
AuthRouter.post("/change-password", changePassword);
