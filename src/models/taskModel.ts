import mongoose, { Schema } from "mongoose";

import { Task as ITask } from "../interfaces";

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    completed: Boolean,
    deleted: Boolean,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: String
  },
  { timestamps: true },
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
