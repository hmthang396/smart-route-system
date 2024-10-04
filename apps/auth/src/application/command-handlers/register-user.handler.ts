import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterUserCommand } from "../commands";
import { Inject } from "@nestjs/common";
import { HashHelper } from "@app/common/helpers";
import { UnitOfWork } from "@app/auth/infrastructure/unit-of-work/unit-of-work.service";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { Transactional } from "../../common/decorators";
import { UserAccount } from "@app/common";

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, UserAccount> {
  constructor(
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  @Transactional({
    replication: true,
    isolationLevel: "SERIALIZABLE",
  })
  async execute(command: RegisterUserCommand): Promise<UserAccount> {
      // Use the user service to register the user
      const userAccount = await this.unitOfWork.getUserAccountRepository().createUserAccount({
        userAccount: command.userAccount,
        userLogin: command.userLogin,
      });

      const userLoginData = await this.unitOfWork.getUserLoginDataRepository().createUserLoginData({
        email: command.userLogin.email,
        passwordHash: await HashHelper.encrypt(command.userLogin.password),
        userId: userAccount.userId,
      });

      userAccount.userLoginData = userLoginData;

      return userAccount;
  }
}
