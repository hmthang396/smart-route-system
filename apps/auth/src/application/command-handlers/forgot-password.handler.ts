import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForgotPasswordCommand } from "../commands";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { Inject, NotFoundException } from "@nestjs/common";
import { UnitOfWork } from "@app/auth/infrastructure/unit-of-work/unit-of-work.service";
import { Transactional } from "../../common/decorators";
import * as crypto from "crypto";
import { JwtTokenService } from "@app/auth/infrastructure/services/jwt-token/jwt.service";
import { IJwtService } from "@app/auth/domain/adapters";

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

    await Promise.all([
      await this.unitOfWork
        .getUserLoginDataRepository()
        .updatePasswordRecoveryToken(email, token.token, new Date(token.expiresAt * 1000)),
    ]);

    return true;
  }

  private generateToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    return { token, expiration };
  }
}
