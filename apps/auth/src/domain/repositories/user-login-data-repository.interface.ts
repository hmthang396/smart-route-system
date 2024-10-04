import { UserLoginData } from "@app/common";

export interface IUserLoginDataRepository {
  getEntityManager(): unknown;

  createUserLoginData(dto: Pick<UserLoginData, "userId" | "email" | "passwordHash">): Promise<UserLoginData>;

  findByEmail(email: string): Promise<UserLoginData | null>;

  updatePasswordRecoveryToken(email: string, token: string, expiration: Date): Promise<boolean>;

  updateUserLoginData(userLoginData: UserLoginData): Promise<boolean>;
}
