import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { getAccessToken } from "../utils/token";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    // 1. No refresh token at all → unauthorized
    if (!refreshToken) {
      const err: any = new Error("Unauthorized. Please login/register");
      err.statusCode = 401;
      return next(err);
    }

    // 2. Access token exists → verify
    if (accessToken) {
      try {
        const secretKey = process.env.SECRET || "Ritick";
        const decoded = jwt.verify(accessToken, secretKey) as any;

        // 2.a Verified → add userId to req and move to next handler
        // @ts-ignore
        req.userId = decoded.id;
        return next();
      } catch (error: any) {
        // 2.b If access token expired → check refresh token in DB
        if (error.name === "TokenExpiredError" && refreshToken) {
          const user = await User.findOne({ refreshToken });
          if (!user) {
            const err: any = new Error("Unauthorized: Please login.");
            err.statusCode = 401;
            return next(err);
          }

          // 2.b.i Issue new access token
          const newAccessToken = getAccessToken(
            user.username,
            user._id.toString()
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 5 * 60 * 60 * 1000, // 5 hours
          });

          // 2.b.ii Renewed the access token and move to next handler
          // @ts-ignore
          req.userId = user._id.toString();
          return next();
        }

        // 2.c Any other token error (tampered/invalid)
        const err: any = new Error("Invalid access token");
        err.statusCode = 401;
        return next(err);
      }
    }

    // 3. No access token (browser deleted after expiry) → validate refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      const err: any = new Error("Unauthorized: Please login.");
      err.statusCode = 401;
      return next(err);
    }

    // 3.a Issue new access token from refresh
    const newAccessToken = getAccessToken(user.username, user._id.toString());
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 60 * 1000,
    });

    // 3.b Renewed access token → attach user and move forward
    // @ts-ignore
    req.userId = user._id.toString();
    return next();
  } catch (error: any) {
    return next(error);
  }
};

// 1 No refresh token → reject immediately.

// 2 → Access token exists:

//   2.a Valid → pass through.

//   2.b Expired → check refresh:

//       2.b.i Issue new access token.
//       2.b.ii Continue.

//   2.c Invalid → reject.

// 3 → No access token (expired & browser deleted), but refresh exists:

//   3.a Issue new access token.
//   3.b Continue.
