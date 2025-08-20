import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ===== TEST ROUTE =====
app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

export default app;
