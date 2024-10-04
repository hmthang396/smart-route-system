import { UserAccount, UserLoginData } from "@app/common";

export interface IUserAccountRepository {
  getEntityManager(): unknown;

  findOneByEmail(email: string): Promise<UserAccount | null>;

  findOneByUUID(uuid: string): Promise<UserAccount | null>;

  createUserAccount(dto: {
    userLogin: Partial<UserLoginData>;
    userAccount: Partial<UserAccount>;
  }): Promise<UserAccount>;

  markAsActive(uuid: string): Promise<void>;

  findOneByConfirmationToken(token: string): Promise<UserAccount | null>;
}
