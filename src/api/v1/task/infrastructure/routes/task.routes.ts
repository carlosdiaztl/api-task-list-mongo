import { Router } from "express";
import { taskController } from "../service/task.service";

export const taskRoutes = Router();
taskRoutes.get("/", taskController.listTask)
taskRoutes.post("/", taskController.createTask)