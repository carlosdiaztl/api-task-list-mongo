import { Router } from "express";
import { taskController } from "../service/task.service";

export const taskRoutes = Router();
taskRoutes.get("/", taskController.listTask)
taskRoutes.get("/:id", taskController.getTaskById)
taskRoutes.post("/", taskController.createTask)
taskRoutes.put("/:id", taskController.updateTask)
taskRoutes.delete("/:id", taskController.deleteTask)