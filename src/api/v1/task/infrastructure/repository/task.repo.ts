import { ITaskRepository } from "../../domain/task.entity";
import { ITask, TaskModel } from "../model/task.model";

export class TaskRepository implements ITaskRepository {
    /**
     * Retrieves all tasks in the database
     * @returns {Promise<ITask[]>} a promise that resolves with an array of tasks
     */
    async findAll(): Promise<ITask[]> {
    return await TaskModel.find();
  }
    findById(id: number): Promise<ITask | null> {
        return TaskModel.findById(id);
    }
    create (taskData: ITask): Promise<ITask> {
        return TaskModel.create(taskData);
    }
    updated(id: number, taskData: ITask): Promise<ITask | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<number | null> {
        throw new Error("Method not implemented.");
    }
}