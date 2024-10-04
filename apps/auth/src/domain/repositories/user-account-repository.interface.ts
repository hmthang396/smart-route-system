import { UserAccount, UserLoginData } from "@app/common";

export interface IUserAccountRepository {
  getEntityManager(): unknown;

  findOneByEmail(email: string): Promise<UserAccount | null>;

  findOneByUUID(uuid: string): Promise<UserAccount | null>;

  createUserAccount(dto: {
    userLogin: Partial<UserLoginData>;
    userAccount: Partial<UserAccount>;
  }): Promise<UserAccount>;

  // updateStatus(id: number, status: UserAccountStatus): Promise<boolean>;
}
