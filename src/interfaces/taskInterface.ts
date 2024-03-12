import User from "./userInterface";

interface Task {
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  deleted: boolean;
  user: User;
}

export default Task;
