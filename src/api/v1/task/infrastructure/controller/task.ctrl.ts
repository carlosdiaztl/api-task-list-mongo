import {fromStatusAndCode, warning } from './../../../../../app/utils/responses';
import { Request, Response } from "express";
import { TaskUseCase } from "../../application/task.usecase";
import { EErrorMessage, ECodeHTTPStatus } from './../../../../../app/utils/enums';

export class TaskController {
  constructor(
    private readonly TaskUseCase: TaskUseCase,
  ) {}

  public listTask = async ({ method }: Request, res: Response) => {
    try {
      const Task = await this.TaskUseCase.listTasks();
      fromStatusAndCode(res, Task, method);
    } catch (error: unknown) {
      const errorAsError = error as Error;
      return warning(
        res,
        EErrorMessage.GET_DATA_ERROR,
        ECodeHTTPStatus.INTERNAL_SERVER_ERROR,
        errorAsError.message
      );
    }
  };

  public getTaskById = async (
    { params: { id }, method }: Request,
    res: Response
  ) => {
    try {
      const Task = await this.TaskUseCase.getTaskById(
        id
      );
      if (!Task) {
        return warning(
          res,
          EErrorMessage.NOT_FOUND_ERROR,
          ECodeHTTPStatus.NOT_FOUND,
          "Task not found"
        );
      }
      fromStatusAndCode(res, Task, method);
    } catch (error: unknown) {
      const errorAsError = error as Error;
      return warning(
        res,
        EErrorMessage.GET_DATA_ERROR,
        ECodeHTTPStatus.INTERNAL_SERVER_ERROR,
        errorAsError.message
      );
    }
  };

  public createTask = async (
    { body  , method, headers }: Request,
    res: Response
  ) => {
    try {
     
      const Task = await this.TaskUseCase.createTask(
        body
      );
      fromStatusAndCode(res, Task, method);
    } catch (error: unknown) {
      const errorAsError = error as Error;
      return warning(
        res,
        EErrorMessage.CREATE_DATA_ERROR,
        ECodeHTTPStatus.INTERNAL_SERVER_ERROR,
        errorAsError.message
      );
    }
  };

 // Assuming this is inside TaskController class
public updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = req.params.id;
      console.log('Taskid:', taskId);

      // IMPORTANT: Use the correct instance name (lowercase 't' if that's how it's named)
      const existingTask = await this.TaskUseCase.getTaskById(taskId);
      console.log('TaskController.updateTask - Task:', existingTask);

      if (!existingTask) {
        // Use your standardized warning helper for not found
        return warning(
          res,
          EErrorMessage.NOT_FOUND_ERROR,
          ECodeHTTPStatus.NOT_FOUND,
          "Task not found"
        );
      }

      const updateData = req.body;

      // Ensure that `updateData` has the correct type for `UpdateTaskInput`
      // You might want to add a validation layer here (e.g., Joi, Zod) to ensure req.body conforms to UpdateTaskInput
      const input = { id: taskId, ...updateData };

      // Call the use case method
      const updatedTask = await this.TaskUseCase.updateTask(input);

      // Use only one response sender
      fromStatusAndCode(res, updatedTask, req.method); // This handles setting status and sending JSON

    } catch (error: any) {
      console.error('Error in TaskController.updateTask:', error.message);
      // Use your standardized warning helper for errors
      return warning(
        res,
        EErrorMessage.UPDATE_DATA_ERROR, // Or a more specific error message type if available
        ECodeHTTPStatus.INTERNAL_SERVER_ERROR, // Or a more specific HTTP status if the error message implies it (e.g., 400 for validation errors)
        error.message
      );
    }
  }
 public deleteTask = async (
    { params: { id }, method }: Request,
    res: Response
  ) => {
    try {
      const Task = await this.TaskUseCase.deleteTask(
        id
      );
      if (!Task) {
        return warning(
          res,
          EErrorMessage.NOT_FOUND_ERROR,
          ECodeHTTPStatus.NOT_FOUND,
          "Task not found"
        );
      }
      
      return fromStatusAndCode(res, Task, method)
    } catch (error: unknown) {
      const errorAsError = error as Error;
      return warning(
        res,
        EErrorMessage.DELETE_DATA_ERROR,
        ECodeHTTPStatus.INTERNAL_SERVER_ERROR,
        errorAsError.message
      );
    }
  };

}
