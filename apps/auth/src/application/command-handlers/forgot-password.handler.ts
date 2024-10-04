import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForgotPasswordCommand } from "../commands";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { Inject, NotFoundException } from "@nestjs/common";
import { UnitOfWork } from "@app/auth/infrastructure/unit-of-work/unit-of-work.service";
import { Transactional } from "../../common/decorators";
import { JwtTokenService } from "@app/auth/infrastructure/services/jwt-token/jwt.service";
import { IJwtService } from "@app/auth/domain/adapters";
import { Outbox } from "@app/common";

@CommandHandler(ForgotPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ForgotPasswordCommand, boolean> {
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
  async execute(command: ForgotPasswordCommand): Promise<boolean> {
    const { email } = command;

    const userAccount = await this.unitOfWork.getUserAccountRepository().findOneByEmail(email);

    if (!userAccount) {
      throw new NotFoundException();
    }

    const token = await this.jwtTokenService.generatePasswordRecoveryToken(userAccount.uuid);

    const outbox = new Outbox({
      eventType: "User.ForgotPassword",
      payload: userAccount,
    });

    await Promise.all([
      this.unitOfWork
        .getUserLoginDataRepository()
        .updatePasswordRecoveryToken(email, token.token, new Date(token.expiresAt * 1000)),
      this.unitOfWork.getOutboxRepository().createOutbox(outbox),
    ]);

    return true;
  }
}
