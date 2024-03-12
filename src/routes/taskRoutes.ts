import express from "express";

import { authorization } from "../middlewares";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers";

const router = express.Router();

router.use(authorization);

router.get("/", getAllTasks);
router.post("/", createTask);
router.delete("/:taskId", deleteTask);
router.put("/:taskId", updateTask);

export default router;
