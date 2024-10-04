import { Gender, UserAccountStatus } from "../enums";
import { UserLoginData } from "./user-login-data.model";

export class UserAccount {
  constructor(data?: Partial<UserAccount>) {
    Object.assign(this, { ...data });
  }
  userId: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  phoneNumber: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  userLoginData: UserLoginData;
  status: UserAccountStatus;
}
