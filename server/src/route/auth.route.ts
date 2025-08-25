import { Router } from "express";
import * as Auth from "../controller/auth.controller";
import { isAuthenticated } from "../middleware";

export const AuthRouter = Router();

AuthRouter.get("/me", isAuthenticated, Auth.getMe);

// Register new account
AuthRouter.post("/register", Auth.register);

// Login and get access + refresh token
AuthRouter.post("/login", Auth.login);

// Logout (invalidate refresh token)
AuthRouter.post("/logout", isAuthenticated, Auth.logout);

// Forgot password (send reset link) (when not logged in: so send email)
AuthRouter.post("/forgot-password", Auth.forgotPassword);

// Validate reset token before showing password form
AuthRouter.get("/reset-password/:id", Auth.resetPassword);

// Update password after successful validation
AuthRouter.post("/reset-password/:id", Auth.resetPasswordPost);

// Change password (while logged in) (by providing old password only: no mail sent.)
AuthRouter.post("/change-password", isAuthenticated, Auth.changePassword);
