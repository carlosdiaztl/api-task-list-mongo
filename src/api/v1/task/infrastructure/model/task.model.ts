// src/models/task.model.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import { TaskPriority, TaskStatus } from '../../domain/task.value';

// ====================================================================
// Enums para Status y Priority (si no los tienes ya)
// ====================================================================


// ====================================================================
// 1. Interfaz para el Sub-Documento de Historial
// ====================================================================
// Este sub-documento no extiende Document directamente porque no es una colección propia.
export interface ITaskHistory {
  timestamp: Date;
  changeType: string;   // Ej: "Status Changed", "Description Updated", "Task Created"
  fieldChanged?: string; // Nombre del campo que cambió (ej: 'status', 'description', 'priority')
  oldValue?: any;       // Valor antiguo del campo (Schema.Types.Mixed para cualquier tipo)
  newValue?: any;       // Nuevo valor del campo
  description?: string; // Descripción adicional del cambio (ej: "Task was marked as done.")
}

// ====================================================================
// 2. Interfaz Principal para el Documento de Tarea (ITask)
//    Ahora incluye el array de historial.
// ====================================================================
export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  tags?: string[];
  history: ITaskHistory[]; // <-- ¡Aquí se añade el array de historial!
  createdAt?: Date;
  updatedAt?: Date;

}

// ====================================================================
// 3. Definición del Esquema para el Sub-Documento de Historial
// ====================================================================
const TaskHistorySchema: Schema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  changeType: { type: String, required: true },
  fieldChanged: { type: String },
  oldValue: { type: Schema.Types.Mixed }, // Permite almacenar cualquier tipo de dato
  newValue: { type: Schema.Types.Mixed },
  description: { type: String },
}, { _id: false }); // _id: false para sub-documentos si no necesitas un ID único para cada entrada de historial.
                    // Si _id es necesario, quita esta opción.

// ====================================================================
// 4. Definición del Esquema Principal de la Tarea
//    Ahora incluye el array de historial con el sub-esquema definido.
// ====================================================================
const TaskSchema: Schema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters long'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: Object.values(TaskStatus),
      default: TaskStatus.Pending,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.Medium,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due Date is required'],
      validate: {
        validator: function (v: Date) {
          // Asegura que la fecha de vencimiento no sea pasada
          return v > new Date();
        },
        message: 'Due Date cannot be in the past',
      },
    },
    tags: {
      type: [String], // Array de strings
      default: [],
      // Validación para tags únicos (Mongoose Array Uniqueness Plugin o lógica manual)
      // Para hacer que los tags sean únicos, una forma es procesarlos antes de guardar,
      // o usar un plugin como mongoose-unique-array si es necesario.
      // Por ahora, el test pide que "tags can only contain unique values" en la validación POST,
      // lo cual puedes manejar en tu controlador/servicio antes de pasar a Mongoose.
    },
    history: [TaskHistorySchema], // <-- ¡Aquí se enlaza el sub-documento de historial!
  },
  {
    timestamps: true, // Esto añade 'createdAt' y 'updatedAt'
    collection: 'tasks',
  }
);

// Añadir índices para optimizar las consultas, como se pide en la prueba
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ tags: 1 });

// ====================================================================
// 5. Creación y Exportación del Modelo
// ====================================================================
export const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
