import { IUser } from "../infrastructure/model/user.model";

export interface IUsersAccountRepository {
  create(usersAccountData: IUser): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  findById(id: number): Promise<IUser | null>;
}

