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
        +id
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
     
      //const idUserLogged = getIdUserLogged(header);
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

//   public updateTask = async (
//     { 
//       params: { id }, 
//       body: { userUpdate, userUInstitutions}, 
//       method,
//       headers
//     }: Request,
//     res: Response
//   ) => {
//     try {
//       const token = headers.authorization?.split(" ")[1];
//       if (!token) {
//         throw new Error("Token not found");
//       }
//       const Task = await this.TaskUseCase.updateTask(
//         token,
//         +id,
//         userUpdate,
//         userUInstitutions
//       );
//       fromStatusAndCode(res, Task, method);
//     } catch (error: unknown) {
//       const errorAsError = error as Error;
//       return warning(
//         res,
//         EErrorMessage.UPDATE_DATA_ERROR,
//         ECodeHTTPStatus.INTERNAL_SERVER_ERROR,
//         errorAsError.message
//       );
//     }
//   };

//   public deleteTask = async (
//     { headers, params: { id }, method }: Request,
//     res: Response
//   ) => {
//     try {
//       await validateTokenAndRole(headers, [1], this.TaskUseCase);
//       await this.TaskUseCase.deleteTask(+id);
//       return res.status(ECodeHTTPStatus.OK).json({
//         message: "User deleted successfully",
//       });
//     } catch (error: unknown) {
//       const errorAsError = error as Error;
//       return warning(
//         res,
//         EErrorMessage.DELETE_DATA_ERROR,
//         ECodeHTTPStatus.INTERNAL_SERVER_ERROR,
//         errorAsError.message
//       );
//     }
//   };
}
