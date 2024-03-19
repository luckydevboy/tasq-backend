import express from "express";

import { authorization } from "../middlewares";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers";

const router = express.Router();

router.use(authorization);

router.get("/:filter?", getTasks);
router.post("/", createTask);
router.delete("/:taskId", deleteTask);
router.put("/:taskId", updateTask);

export default router;
