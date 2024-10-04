import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResendVerificationEmailCommand } from "../commands";
import { UnitOfWork } from "@app/auth/infrastructure/unit-of-work/unit-of-work.service";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { JwtTokenService } from "@app/auth/infrastructure/services/jwt-token/jwt.service";
import { IJwtService } from "@app/auth/domain/adapters";
import { Outbox, UserAccountStatus } from "@app/common";

@CommandHandler(ResendVerificationEmailCommand)
export class ResendVerificationEmailHandler implements ICommandHandler<ResendVerificationEmailCommand, boolean> {
  constructor(
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(JwtTokenService)
    private readonly jwtTokenService: IJwtService,
  ) {}

  async execute(command: ResendVerificationEmailCommand): Promise<boolean> {
    const { email } = command;

    const userAccount = await this.unitOfWork.getUserAccountRepository().findOneByEmail(email);

    if (!userAccount) throw new NotFoundException(`User not found`);

    if (userAccount.status !== UserAccountStatus.INACTIVE) {
      throw new BadRequestException(`User is already verified`);
    }

    const verificationToken = await this.jwtTokenService.generateConfirmationToken(userAccount.uuid);

    await Promise.all([
      this.unitOfWork
        .getUserLoginDataRepository()
        .updateConfirmationToken(userAccount.userLoginData.uuid, verificationToken.token),
      this.unitOfWork.getOutboxRepository().createOutbox(
        new Outbox({
          eventType: "User.Created",
          payload: {
            userAccount,
          },
        }),
      ),
    ]);

    return true;
  }
}
