import { EmailStatus } from "../enums";

export class UserLoginData {
  constructor(data?: Partial<UserLoginData>) {
    Object.assign(this, { ...data });
  }
  id: number;
  uuid: string;
  userAccountId: number;
  passwordHash: string;
  email: string;
  emailStatus: EmailStatus;
  passwordRecoveryToken: string;
  confirmationToken: string;
  isTwoFactorEnabled: boolean;
  isTwoFactorVerified: boolean;
  twoFactorSecret: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
