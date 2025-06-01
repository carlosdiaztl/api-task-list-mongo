import { ITask } from "../infrastructure/model/task.model";
export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}
export const taskNotNullKeys = ['title', 'status', 'dueDate'];
export interface UpdateTaskInput {
    id:string; // El ID de la tarea a actualizar
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
    tags?: string[];
}
export type UpdatableTaskFields = Omit<
  ITask,
  "_id" | "createdAt" | "updatedAt" | "history"
>;

export interface UpdateTaskInput extends Partial<UpdatableTaskFields> {
  id: string; // El ID de la tarea es siempre requerido para la actualización
}

// 2. Ajusta FieldConfig para que K sea una clave de UpdatableTaskFields
// Esto garantiza que fieldName siempre será una propiedad que existe en UpdateTaskInput (excepto 'id').
export interface FieldConfig<K extends keyof UpdatableTaskFields> {
  // <--- CAMBIO CLAVE AQUÍ
  fieldName: K;
  validator?: (value: any, name: string, ...args: any[]) => any;
  validationArgs?: any[];
  customComparison?: (oldVal: ITask[K], newVal: ITask[K]) => boolean;
  customDescription?: (oldVal: ITask[K], newVal: ITask[K]) => string;
  preProcess?: (
    inputValue: UpdatableTaskFields[K] | undefined,
    existingTask: ITask
  ) => ITask[K] | undefined; // <--- Ajuste de tipo para inputValue
}


// Helper para validar el formato de ObjectId de MongoDB

export const taskOmitKeys = ['_id', 'createdAt', 'updatedAt', 'history', 'description', 'priority', 'tags']