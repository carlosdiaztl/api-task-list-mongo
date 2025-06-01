import { ITaskRepository } from "../domain/task.entity";
import { ITask, ITaskHistory } from "../infrastructure/model/task.model";

import {
  validateFutureDate,
  validateRequiredEnum,
  processUniqueTags,
  validateFields,
  validateRequiredString,
} from "../../../../app/utils/validators";
import {
  FieldConfig,
  taskNotNullKeys,
  taskOmitKeys,
  TaskPriority,
  TaskStatus,
  UpdatableTaskFields,
  UpdateTaskInput,
} from "../domain/task.value";
import { isValidObjectId } from "mongoose";


export class TaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async listTasks(): Promise<ITask[]> {
    return await this.taskRepository.findAll();
  }
  async getTaskById(id: string): Promise<ITask | null> {
    if (!isValidObjectId(id)){
      throw new Error("ID is not valid.");
    }        
    return await this.taskRepository.findById(id);
  }
   async deleteTask(id: string): Promise<boolean> {
    if (!isValidObjectId(id)){
      throw new Error("ID is not valid.");
    }        
    return await this.taskRepository.delete(id);
  }
  async createTask(taskData: ITask): Promise<ITask> {
    // Cambié el nombre del parámetro a taskData para mayor claridad
    // --- 1. Validaciones de Negocio ---

    // Paso 1.1: Validación genérica de campos requeridos (not null/empty strings)
    // Usamos 'taskData' como el objeto de datos a validar
    validateFields(taskData, taskNotNullKeys, taskOmitKeys);

    // Paso 1.2: Validaciones específicas de la lógica de negocio de Tareas

    // Validar 'title' con longitud mínima
    if (taskData.title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters long.");
    }
    const title = taskData.title.trim(); // Asegura el valor limpio

    // Validar 'status' como enum válido
    const status = validateRequiredEnum(taskData.status, "Status", TaskStatus);

    // Validar 'dueDate' como fecha futura válida
    const dueDate = validateFutureDate(taskData.dueDate, "Due Date");

    // Procesar 'tags' para unicidad y limpieza
    const tags = processUniqueTags(taskData.tags);

    // Prioridad: Se valida si viene, si no, se asigna el valor por defecto 'Medium'.
    let taskPriority: TaskPriority;
    try {
      taskPriority = validateRequiredEnum(
        taskData.priority,
        "Priority",
        TaskPriority
      );
    } catch (error) {
      taskPriority = TaskPriority.Medium; // Asigna el default si no es válido o está ausente
    }

    // --- 2. Construcción de la Entidad de Dominio (ITask) con los datos procesados ---
    // Creamos un nuevo objeto ITask que refleje todas las validaciones y transformaciones.
    // Esto es importante para asegurarnos de que los datos pasados al repositorio estén limpios
    // y contengan toda la información de negocio necesaria (como el historial).
    const initialHistoryEntry: ITaskHistory = {
      timestamp: new Date(),
      changeType: "Task Created",
      description: "New task was created.",
    };

    const taskEntity: ITask = {
      title: title, // Usamos el título limpio
      description: taskData.description
        ? taskData.description.trim()
        : undefined, // Descripción limpia
      status: status, // Estado validado
      priority: taskPriority, // Prioridad validada/por defecto
      dueDate: dueDate, // Fecha validada
      tags: tags, // Tags limpios y únicos
      history: [initialHistoryEntry], // ¡Añadimos la entrada de historial aquí!
      // No incluimos _id, createdAt, updatedAt aquí; Mongoose los añadirá.
    } as ITask;

    // --- 3. Llamar al Repositorio para la Persistencia ---
    // Pasamos la 'taskEntity' recién construida y validada al repositorio.
    return await this.taskRepository.create(taskEntity);
  }
  private _processUpdatesAndGenerateHistory(
    existingTask: ITask,
    input: UpdateTaskInput
  ): { updates: Partial<ITask>; historyEntries: ITaskHistory[] } {
    const updates: Partial<ITask> = {};
    const historyEntries: ITaskHistory[] = [];

    // Helpers comunes para comparaciones que se repiten (arrays, fechas)
    const compareArrays = (
      oldArr: any[] | undefined,
      newArr: any[] | undefined
    ): boolean => {
      const oldSorted = [...(oldArr || [])].sort().join(",");
      const newSorted = [...(newArr || [])].sort().join(",");
      return oldSorted !== newSorted;
    };

    const compareDates = (
      oldDate: Date | undefined,
      newDate: Date | undefined
    ): boolean => {
      if (!oldDate && !newDate) return false;
      if (!oldDate || !newDate) return true;
      return oldDate.getTime() !== newDate.getTime();
    };

    // --- Definición declarativa de la configuración para cada campo ---
    // El tipo de fieldConfigurations debe reflejar el nuevo FieldConfig
    const fieldConfigurations: FieldConfig<keyof UpdatableTaskFields>[] = [
      // <--- CAMBIO CLAVE AQUÍ
      {
        fieldName: "title",
        validator: validateRequiredString,
        validationArgs: [3],
        customDescription: (oldVal, newVal) =>
          `Title changed from "${oldVal}" to "${newVal}".`,
      },
      {
        fieldName: "description",
        validator: (val) => (val as string)?.trim(),
      },
      {
        fieldName: "status",
        validator: validateRequiredEnum,
        validationArgs: [TaskStatus],
        customDescription: (oldVal, newVal) => {
          if (
            oldVal === TaskStatus.Completed &&
            newVal !== TaskStatus.Completed
          ) {
            throw new Error(
              "Cannot change task status from 'Completed' back to 'Pending' or 'InProgress'."
            );
          }
          return `Status changed from "${oldVal}" to "${newVal}".`;
        },
      },
      {
        fieldName: "priority",
        preProcess: (inputValue) => {
          if (inputValue === undefined) return undefined;
          try {
            return validateRequiredEnum(
              inputValue as TaskPriority,
              "Priority",
              TaskPriority
            );
          } catch (error) {
            throw error;
          }
        },
        customDescription: (oldVal, newVal) =>
          `Priority changed from "${oldVal}" to "${newVal}".`,
      },
      {
        fieldName: "dueDate",
        validator: validateFutureDate,
        customComparison: compareDates,
        customDescription: (oldVal, newVal) =>
          `Due Date changed from "${
            (oldVal as Date)?.toISOString().split("T")[0] || "N/A"
          }" to "${(newVal as Date)?.toISOString().split("T")[0] || "N/A"}".`,
      },
      {
        fieldName: "tags",
        validator: processUniqueTags,
        customComparison: compareArrays,
        customDescription: (oldVal, newVal) =>
          `Tags updated from [${((oldVal as string[]) || []).join(
            ", "
          )}] to [${((newVal as string[]) || []).join(", ")}].`,
      },
    ];

    // --- Iterar sobre las configuraciones para procesar cada campo ---
    for (const config of fieldConfigurations) {
      const {
        fieldName,
        validator,
        validationArgs,
        customComparison,
        customDescription,
        preProcess,
      } = config;

      // CORRECTO: Accede a input[fieldName] con el tipo correcto
      // fieldName es ahora `keyof UpdatableTaskFields`, lo que garantiza que existe en `input`
      // y que `input[fieldName]` tendrá el tipo `UpdatableTaskFields[typeof fieldName] | undefined`.
      let rawInputValue: UpdatableTaskFields[typeof fieldName] | undefined =
        input[fieldName];

      // processedInputValue tendrá el tipo de ITask[typeof fieldName] | undefined
      let processedInputValue: ITask[typeof fieldName] | undefined;

      if (preProcess) {
        // preProcess recibe UpdatableTaskFields[typeof fieldName]
        // y se espera que devuelva ITask[typeof fieldName]
        processedInputValue = preProcess(rawInputValue, existingTask);
      } else {
        // Si no hay preProcess, hacemos un cast seguro si el valor no es undefined.
        // Esto es necesario porque UpdatableTaskFields[K] no es siempre directamente asignable a ITask[K]
        // (ej. 'string' de input a 'TaskStatus' enum).
        processedInputValue = rawInputValue as
          | ITask[typeof fieldName]
          | undefined;
      }

      if (processedInputValue === undefined) {
        continue;
      }

      const oldValue = existingTask[fieldName]; // Este tipo es ITask[typeof fieldName]
      let finalValueForITask: ITask[typeof fieldName]; // Este será el valor final, ya validado y en el tipo ITask

      // 1. Validar y transformar el nuevo valor
      try {
        if (validator) {
          // El validador espera el tipo que processedInputValue tiene y devuelve el tipo ITask[typeof fieldName]
          finalValueForITask = validator(
            processedInputValue,
            fieldName.toString(),
            ...(validationArgs || [])
          );
        } else if (typeof processedInputValue === "string") {
          finalValueForITask = (
            processedInputValue as string
          ).trim() as ITask[typeof fieldName];
        } else {
          finalValueForITask = processedInputValue; // Asignación directa si no hay validador o transformación.
        }
      } catch (validationError: any) {
        throw validationError;
      }

      // 2. Detectar si el valor ha cambiado realmente
      let hasChanged = false;
      if (customComparison) {
        hasChanged = customComparison(oldValue, finalValueForITask);
      } else if (Array.isArray(oldValue) && Array.isArray(finalValueForITask)) {
        hasChanged = compareArrays(oldValue, finalValueForITask);
      } else if (
        oldValue instanceof Date &&
        finalValueForITask instanceof Date
      ) {
        hasChanged = compareDates(oldValue, finalValueForITask);
      } else {
        hasChanged = oldValue !== finalValueForITask;
      }

      // 3. Si el valor ha cambiado, añadirlo al objeto de actualizaciones y generar una entrada de historial
      if (hasChanged) {
        updates[fieldName] = finalValueForITask;
        historyEntries.push({
          timestamp: new Date(),
          changeType: "Field Updated",
          fieldChanged: fieldName.toString(),
          oldValue: oldValue,
          newValue: finalValueForITask,
          description: customDescription
            ? customDescription(oldValue, finalValueForITask)
            : `${fieldName.toString()} changed from "${oldValue}" to "${finalValueForITask}".`,
        });
      }
    }

    return { updates, historyEntries };
  }

  // --- Método público: updateTask ---
  // Este método es el punto de entrada para actualizar una tarea, incluyendo su historial.
  async updateTask(input: UpdateTaskInput): Promise<ITask> {
    // 1. Validar la presencia del ID de la tarea
    if (!input.id) {
      throw new Error("Task ID is required for update.");
    }

    // 2. Buscar la tarea existente en el repositorio
    const existingTask = await this.taskRepository.findById(input.id);
    if (!existingTask) {
      throw new Error(`Task with ID ${input.id} not found.`);
    }

    // 3. Obtener las actualizaciones de campos y las entradas de historial usando la función auxiliar.
    // Aquí ocurre la lógica central de detección de cambios, validación y generación de historial.
    const { updates, historyEntries } = this._processUpdatesAndGenerateHistory(
      existingTask,
      input
    );

    // 4. Si no se detectaron cambios ni se generaron entradas de historial,
    // significa que el input era idéntico al estado actual. Devolvemos la tarea existente.
    if (Object.keys(updates).length === 0 && historyEntries.length === 0) {
      return existingTask;
    }

    // 5. Añadir las nuevas entradas de historial al array de historial que se enviará al repositorio.
    // Esto asegura que el historial existente se mantenga y las nuevas entradas se añadan.
    updates.history = [...(existingTask.history || []), ...historyEntries];

    // 6. Llamar al repositorio para persistir la actualización en la base de datos.
    // Al pasar 'updates', Mongoose solo actualizará los campos especificados, incluyendo el historial.
    const updatedTask = await this.taskRepository.updated(input.id, updates);

    // 7. Verificar si la actualización fue exitosa
    if (!updatedTask) {
      throw new Error(
        `Failed to update task with ID ${input.id}: Task not found after re-check.`
      );
    }

    // 8. Devolver la tarea actualizada con su historial completo.
    return updatedTask;
  }
}
