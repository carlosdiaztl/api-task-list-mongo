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
    findById(id: string): Promise<ITask | null> {
        return TaskModel.findById(id);
    }
    create (taskData: ITask): Promise<ITask> {
        return TaskModel.create(taskData);
    }
    async updated(id: string, updates: Partial<ITask>): Promise<ITask | null> { // <-- Aquí el cambio importante
    // findByIdAndUpdate encuentra un documento por su _id y lo actualiza.
    // { new: true } asegura que el documento devuelto sea el actualizado, no el original.
    // También puedes añadir { runValidators: true } si quieres que las validaciones del esquema de Mongoose se ejecuten en las actualizaciones.
    return await TaskModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }
    async delete(id: string): Promise<boolean> {
        const result = await TaskModel.deleteOne({ _id: id }).exec();
         return result.deletedCount === 1;
    }
}