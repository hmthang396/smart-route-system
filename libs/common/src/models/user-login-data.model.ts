import { EmailStatus } from "../enums";

export class UserLoginData {
  constructor(data?: Partial<UserLoginData>) {
    Object.assign(this, { ...data });
  }

  userId: number;
  uuid: string;

  passwordHash: string;

  email: string;
  emailStatus: EmailStatus;

  confirmationToken: string;
  tokenGenerationTime: Date;

  passwordRecoveryToken: string;
  recoveryTokenTime: Date;

  isTwoFactorEnabled: boolean;
  isTwoFactorVerified: boolean;
  twoFactorSecret: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
