import { IUser } from "../infrastructure/model/user.model";

export class UsersAccountUseCase {
  constructor(
    private readonly usersAccountRepository: IUsersAccountRepository
  ) {}

  async listUsersAccount(): Promise<IUser[]> {
    return await this.usersAccountRepository.findAll();
  };

  async getUsersAccountById(id: number): Promise<IUser | null> {
    return await this.usersAccountRepository.findById(id);
  };

//   public async createUsersAccount(
//     newUser: IUser
//     ,
    
//   ): Promise< IUser
//    > {
//     await validateFields(
//       newUser,
//     );
//     return await validateUserAccount(newUser);
//   };

}
