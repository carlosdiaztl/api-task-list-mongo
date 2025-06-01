import { ITask } from "../infrastructure/model/task.model";

export interface ITaskRepository {
  create(taskData: ITask): Promise<ITask>;
  findAll(): Promise<ITask[]>;
  findById(id: string): Promise<ITask | null>;
   updated(id: string, updates: Partial<ITask>): Promise<ITask | null>
  delete(id: string): Promise<boolean>;
}