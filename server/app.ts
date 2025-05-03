require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);

// test route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// catch-all route
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("HIT: ", req.originalUrl);
  res
    .status(404)
    .json({ message: `${req.originalUrl} Not Found`, path: req.originalUrl });
});

app.use(ErrorMiddleware);
