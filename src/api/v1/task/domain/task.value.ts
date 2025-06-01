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


export const taskOmitKeys = ['_id', 'createdAt', 'updatedAt', 'history', 'description', 'priority', 'tags']