import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyUserCommand } from "../commands";
import { Inject } from "@nestjs/common";
import { UnitOfWork } from "@app/auth/infrastructure/unit-of-work/unit-of-work.service";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { JwtTokenService } from "@app/auth/infrastructure/services/jwt-token/jwt.service";
import { IJwtService } from "@app/auth/domain/adapters";
import { TokenType } from "@app/common";
import { Transactional } from "@app/auth/common/decorators";

@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand, boolean> {
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
  async execute(command: VerifyUserCommand): Promise<boolean> {
    const { verificationToken } = command;

    const payload = await this.jwtTokenService.checkToken(verificationToken, TokenType.VerifyAccountToken);

    if (!payload) return false;

    const { uuid } = payload;

    const userAccount = await this.unitOfWork.getUserAccountRepository().findOneByUUID(uuid);

    if (!userAccount) return false;

    await Promise.all([
      this.unitOfWork.getUserAccountRepository().markAsActive(userAccount.uuid),
      this.unitOfWork.getUserLoginDataRepository().markAsEmailConfirmed(userAccount.userLoginData.uuid),
    ]);

    return true;
  }
}
