import { Request, Response } from "express";

import { Task } from "../models";
import { decodeAuthToken } from "../utils";
import handleErrors from "../utils/handleErrors";

// export const getTasks = async (req: Request, res: Response) => {
//   const page = parseInt(req.query.page as string) || 1;
//   const pageSize = parseInt(req.query.pageSize as string) || 10;

//   try {
//     const userId = decodeAuthToken(req)?.id;

//     const totalCount = await Task.countDocuments({ user: userId });

//     const tasks = await Task.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * pageSize || 0)
//       .limit(pageSize || 10);

//     return res.json({
//       status: "success",
//       data: {
//         tasks,
//         total: totalCount
//       },
//     });
//   } catch (err) {
//     return handleErrors(err, res);
//   }
// };

type Filter = "completed" | "scheduled" | "deleted" | "today";

interface QueryScheduled {
  user: string | undefined;
  dueDate?: { $exists: boolean };
}

interface QueryCompleted {
  user: string | undefined;
  completed?: boolean;
}

interface QueryDeleted {
  user: string | undefined;
  deleted?: boolean;
}

interface QueryToday {
  user: string | undefined;
  scheduledDate?: { $gte: number; $lt: number };
}

interface QueryDefault {
  user: string;
  $or?: ({ deleted: boolean } | { deleted: { $exists: boolean } })[];
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = decodeAuthToken(req)?.id;
    const filter = req.params.filter as Filter;

    let query:
      | QueryScheduled
      | QueryCompleted
      | QueryDeleted
      | QueryToday
      | QueryDefault;

    switch (filter) {
      case "scheduled":
        query = { user: userId, dueDate: { $exists: true } };
        break;
      case "completed":
        query = { user: userId, completed: true };
        break;
      case "deleted":
        query = { user: userId, deleted: true };
        break;
      case "today":
        query = {
          user: userId,
          scheduledDate: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lt: new Date().setHours(23, 59, 59, 999),
          },
        };
        break;
      default:
        query = {
          user: userId,
          $or: [{ deleted: false }, { deleted: { $exists: false } }],
        };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.json({
      status: "success",
      data: {
        tasks,
      },
    });
  } catch (err) {
    return handleErrors(err, res);
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const task = new Task({ title, user: decodeAuthToken(req)?.id });

    await task.save();

    return res.status(201).json({ status: "success", data: { task } });
  } catch (err) {
    return handleErrors(err, res);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, completed, deleted, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(taskId, {
      title,
      description,
      completed,
      deleted,
      dueDate,
    });

    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found!" });
    }

    return res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    return handleErrors(err, res);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found!" });
    }

    await task.deleteOne();

    return res.status(204).send();
  } catch (err) {
    return handleErrors(err, res);
  }
};
