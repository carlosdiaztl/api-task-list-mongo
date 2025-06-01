import { ITask } from "../infrastructure/model/task.model";

export interface ITaskRepository {
  create(taskData: ITask): Promise<ITask>;
  findAll(): Promise<ITask[]>;
  findById(id: number): Promise<ITask | null>;
  updated(id: number, taskData: ITask): Promise<ITask | null>;
  delete(id: number): Promise<number | null>;
}