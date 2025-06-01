import { TaskUseCase } from "../../application/task.usecase";
import { TaskController } from "../controller/task.ctrl";
import { TaskRepository } from "../repository/task.repo";

export const taskRepository = new TaskRepository();
export const taskUseCase = new TaskUseCase(taskRepository);
export const taskController = new TaskController(taskUseCase);