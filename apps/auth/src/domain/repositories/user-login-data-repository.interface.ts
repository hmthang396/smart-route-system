import { UserLoginData } from "@app/common";

export interface IUserLoginDataRepository {
  getEntityManager(): unknown;

  createUserLoginData(
    dto: Pick<UserLoginData, "userId" | "email" | "passwordHash" | "confirmationToken" | "tokenGenerationTime">,
  ): Promise<UserLoginData>;

  findByEmail(email: string): Promise<UserLoginData | null>;

  updatePasswordRecoveryToken(email: string, token: string, expiration: Date): Promise<boolean>;

  updateUserLoginData(userLoginData: UserLoginData): Promise<boolean>;

  markAsEmailConfirmed(uuid: string): Promise<void>;

  updateConfirmationToken(uuid: string, token: string): Promise<boolean>;
}
