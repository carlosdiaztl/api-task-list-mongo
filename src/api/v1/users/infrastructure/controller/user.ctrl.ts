import { UsersAccountUseCase } from './../../application/user.usecase';
import { Request, Response } from "express";

export class UsersAccountController {
  constructor(
    private readonly usersAccountUseCase: UsersAccountUseCase,
  ) {}

  public listUsersAccount = async ({ method }: Request, res: Response) => {
    try {
      const usersaccount = await this.usersAccountUseCase.listUsersAccount();
      fromStatusAndCode(res, usersaccount, method);
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

  public getUsersAccountById = async (
    { params: { id }, method }: Request,
    res: Response
  ) => {
    try {
      const usersaccount = await this.usersAccountUseCase.getUsersAccountById(
        +id
      );
      if (!usersaccount) {
        return warning(
          res,
          EErrorMessage.NOT_FOUND_ERROR,
          ECodeHTTPStatus.NOT_FOUND,
          "UsersAccount not found"
        );
      }
      fromStatusAndCode(res, usersaccount, method);
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

  public createUsersAccount = async (
    { body, method, headers }: Request,
    res: Response
  ) => {
    try {
      const tokenUserL = headers.authorization?.split(" ")[1];
      if (!tokenUserL) {
        throw new Error("Token not found");
      };
      const usersaccount = await this.usersAccountUseCase.createUsersAccount(
        body
      );
      fromStatusAndCode(res, usersaccount, method);
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

}
