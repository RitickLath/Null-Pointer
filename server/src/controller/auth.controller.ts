import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { getAccessToken, getRefreshToken } from "../utils/token";
import { LoginSchema, RegisterSchema } from "../utils/zodValidation";
import * as z from "zod";
import mongoose from "mongoose";
import { sendMail } from "../utils/sendEmail";
import { getRedisClient } from "../config";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, firstName, lastName } = req.body;

  // 1. Basic validation of required fields
  if (!username || !email || !password || !firstName) {
    const err: any = new Error(
      "Username, Email, Password, and First Name are required"
    );
    err.statusCode = 400;
    return next(err);
  }

  // ZOD Validationp
  const validData = RegisterSchema.safeParse(req.body);

  if (!validData.success) {
    const preetyError = z.prettifyError(validData.error);

    const err: any = new Error(preetyError || "Invalid input data");
    err.statusCode = 400;
    return next(err);
  }

  try {
    // 2. Check if user already exists (by email or username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      const err: any = new Error(
        "User with this Email/Username already exists. Please login instead."
      );
      err.statusCode = 409;
      return next(err);
    }

    // (password hashing is handled in pre-save hook)

    // 3. Create a new user
    const newUser = await User.create({
      email,
      password,
      username,
      firstName,
      lastName: lastName || "",
    });

    const id = newUser._id.toString();

    // 4. Generate tokens
    const accessToken = getAccessToken(username, id); // short-lived token
    const refreshToken = getRefreshToken(); // long-lived token

    // 5. Save refresh token in DB (for later invalidate when logged out + Password change)
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // 6. Store tokens in cookies (secure setup)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // CSRF protection
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const safeUser = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    res.status(201).json({ success: true, data: safeUser });
  } catch (error: any) {
    // 8. Pass error to global error handler
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { identifier, password } = req.body;

  // 1. Validate input using Zod
  const validData = LoginSchema.safeParse(req.body);
  if (!validData.success) {
    const prettifyError = z.prettifyError(validData.error);
    const err: any = new Error(prettifyError || "Invalid input");
    err.statusCode = 400;
    return next(err);
  }

  try {
    let userExists;

    // 2. Find user by email or username, include password for comparison
    if (identifier.mode === "email") {
      userExists = await User.findOne({ email: identifier.data }).select(
        "+password"
      );
    } else {
      userExists = await User.findOne({ username: identifier.data }).select(
        "+password"
      );
    }

    if (!userExists) {
      const err: any = new Error("Invalid Credentials");
      err.statusCode = 401;
      return next(err);
    }

    // 3. Compare password
    // @ts-ignore
    const isPasswordCorrect = await userExists.comparePassword(password);
    if (!isPasswordCorrect) {
      const err: any = new Error("Invalid Credentials");
      err.statusCode = 401;
      return next(err);
    }

    // 4. Generate tokens
    const accessToken = getAccessToken(
      userExists.username,
      userExists._id.toString()
    );
    const refreshToken = getRefreshToken();

    // 5. Save refresh token in DB
    userExists.refreshToken = refreshToken;
    await userExists.save();

    // 6. Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Return safe user data
    const safeUser = {
      id: userExists._id,
      username: userExists.username,
      email: userExists.email,
      firstName: userExists.firstName,
      lastName: userExists.lastName,
    };

    res.status(200).json({ success: true, data: safeUser });
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    // From Middleware
    const id = req?.userId;

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    const mongooseId = new mongoose.Types.ObjectId(id as string);

    await User.findByIdAndUpdate(mongooseId, { refreshToken: "" });

    res.status(200).json({ success: true, data: "Logged Out Successfully" });
  } catch (error: any) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ success: true, data: "User Authenticated" });
  } catch (error: any) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // 1. Validate input with zod
    const schema = z.object({
      email: z.string().email(),
    });
    const safeParseEmail = schema.safeParse({ email });

    if (!safeParseEmail.success) {
      const err: any = new Error("Invalid Email");
      err.statusCode = 400;
      return next(err);
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const err: any = new Error("No user with provided email.");
      err.statusCode = 400;
      return next(err);
    }

    // 3. Generate reset token + save to Redis (10 min expiry)
    const resetToken = getRefreshToken();

    const client = getRedisClient();
    await client.set(resetToken, email, { EX: 60 * 10 });

    // 4. Send reset email
    await sendMail(
      email,
      "Password Reset",
      `<a href="http://localhost:5000/api/v1/reset-password/${resetToken}">Click to Reset Password</a>`
    );

    res.status(200).json({
      success: true,
      message: "Check your email for password reset link.",
    });
  } catch (error: any) {
    console.error(error);
    const err: any = new Error("Unable to process request, please try again.");
    err.statusCode = 500;
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err: any = new Error("Invalid Request");
      err.statusCode = 400;
      return next(err);
    }

    const client = getRedisClient();
    const email = await client.get(id);
    if (!email) {
      const err: any = new Error("Invalid or expired token");
      err.statusCode = 400;
      return next(err);
    }

    res.status(200).json({ status: 200, message: "User can change password" });
  } catch (error: any) {
    next(error);
  }
};

export const resetPasswordPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || !newPassword) {
      const err: any = new Error("Token and new password are required");
      err.statusCode = 400;
      return next(err);
    }

    // 1. Check token in Redis
    const client = getRedisClient();
    const email = await client.get(id);
    if (!email) {
      const err: any = new Error("Invalid or expired token");
      err.statusCode = 400;
      return next(err);
    }

    // 2. Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const err: any = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    // 3. update  new password (hook will hash)
    user.password = newPassword;
    await user.save();

    // 4. Delete token from Redis
    await client.del(id);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. Please log in.",
    });
  } catch (error: any) {
    console.error(error);
    const err: any = new Error("Unable to reset password. Please try again.");
    err.statusCode = 500;
    next(err);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      const err: any = new Error("Old and new password are required");
      err.statusCode = 400;
      return next(err);
    }

    // @ts-ignore 
    const userId = req.userId;

    
    const user = await User.findById(userId).select("+password");
    if (!user) {
      const err: any = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    // @ts-ignore
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      const err: any = new Error("Old password is incorrect");
      err.statusCode = 400;
      return next(err);
    }

    // will be hashed by pre-save hook
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    next(error);
  }
};
