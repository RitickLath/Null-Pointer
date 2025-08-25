import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRouter, ProblemRouter } from "./route";
import { ErrorHandler } from "./middleware";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Authentication based routes handled
app.use("/api/v1/auth", AuthRouter);

// Problems based routes handled
app.use("/api/v1/problem", ProblemRouter);

app.use(ErrorHandler);

export default app;
