import { CreateUserAccountDto, CreateUserLoginDataDto } from "../dtos";

export class RegisterUserCommand {
  constructor(
    public readonly userAccount: CreateUserAccountDto,
    public readonly userLogin: CreateUserLoginDataDto,
  ) {}
}
