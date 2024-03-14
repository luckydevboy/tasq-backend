import "dotenv/config";
import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import { authRoutes, taskRoutes } from "./routes";

const app: Application = express();
const port = process.env.PORT as string;

app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://tasq.liara.run"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// TODO: Just in dev mode
app.use(morgan("tiny"));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error!", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
