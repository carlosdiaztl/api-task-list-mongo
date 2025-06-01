import { ITaskRepository } from "../domain/task.entity";
import { ITask, ITaskHistory } from "../infrastructure/model/task.model";
import { validateFutureDate, validateRequiredEnum, processUniqueTags, validateFields } from '../../../../app/utils/validators';
import { taskNotNullKeys, taskOmitKeys, TaskPriority, TaskStatus } from "../domain/task.value";

export class TaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository
    ){}

    async listTasks(): Promise<ITask[]> {
        return await this.taskRepository.findAll();
    }
     async getTaskById(id: number): Promise<ITask | null> {
        return await this.taskRepository.findById(id);
    }
    async createTask(taskData: ITask): Promise<ITask> { // Cambié el nombre del parámetro a taskData para mayor claridad
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
        taskPriority = validateRequiredEnum(taskData.priority, "Priority", TaskPriority);
    } catch (error) {
        taskPriority = TaskPriority.Medium; // Asigna el default si no es válido o está ausente
    }

    // --- 2. Construcción de la Entidad de Dominio (ITask) con los datos procesados ---
    // Creamos un nuevo objeto ITask que refleje todas las validaciones y transformaciones.
    // Esto es importante para asegurarnos de que los datos pasados al repositorio estén limpios
    // y contengan toda la información de negocio necesaria (como el historial).
    const initialHistoryEntry: ITaskHistory = {
      timestamp: new Date(),
      changeType: 'Task Created',
      description: 'New task was created.',
    };

    const taskEntity: ITask = {
      title: title, // Usamos el título limpio
      description: taskData.description ? taskData.description.trim() : undefined, // Descripción limpia
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
}