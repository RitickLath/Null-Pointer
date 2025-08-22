import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./route";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRouter);

export default app;
