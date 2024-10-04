import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginUserCommand } from "../commands";
import { Inject } from "@nestjs/common";
import {
  DisabledUserException,
  ErrorType,
  ITokenDto,
  InvalidCredentialsException,
  UserAccount,
  UserAccountStatus,
} from "@app/common";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { UnitOfWork } from "@app/auth/infrastructure/unit-of-work/unit-of-work.service";
import { Transactional } from "../../common/decorators";
import { HashHelper } from "@app/common/helpers";
import { IJwtService } from "@app/auth/domain/adapters";
import { JwtTokenService } from "@app/auth/infrastructure/services/jwt-token/jwt.service";

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, { user: UserAccount; token: ITokenDto }> {
  constructor(
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(JwtTokenService)
    private readonly jwtTokenService: IJwtService,
  ) {}

  @Transactional({
    replication: true,
    isolationLevel: "SERIALIZABLE",
  })
  async execute(command: LoginUserCommand): Promise<{ user: UserAccount; token: ITokenDto }> {
    const { email, password } = command;

    const userAccount: UserAccount = await this.unitOfWork.getUserAccountRepository().findOneByEmail(email);

    const userLoginData = userAccount?.userLoginData;

    if (!userLoginData || !userAccount) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await HashHelper.compare(password, userLoginData.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    if (userAccount.status == UserAccountStatus.SUSPENDED) {
      throw new DisabledUserException(ErrorType.BlockedUser, `${userAccount.firstName} ${userAccount.lastName}`);
    }

    if (userAccount.status == UserAccountStatus.INACTIVE) {
      throw new DisabledUserException(ErrorType.InactiveUser, `${userAccount.firstName} ${userAccount.lastName}`);
    }

    return this.jwtTokenService.responseAuthWithToken(userAccount);
  }
}
