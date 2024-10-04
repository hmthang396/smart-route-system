import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenCommand } from "../commands";
import { Inject } from "@nestjs/common";
import { JwtTokenService } from "@app/auth/infrastructure/services/jwt-token/jwt.service";
import { IJwtService } from "@app/auth/domain/adapters";
import { EnvironmentConfigService, JWTConfig } from "@app/common";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject(JwtTokenService)
    private readonly jwtTokenService: IJwtService,
    @Inject(EnvironmentConfigService)
    private readonly jwtConfig: JWTConfig,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { payload } = command;

    /**
     * Check Blacklist
     *
     * const userTokens = await this.unitOfWork.getUserTokenRepository().getUserTokenListByUserAccountId(user.id);
     *
     * const oldAccessTokenToBeBlackListed = userTokens.find(
     * (token) => token.type === UserTokenType.Access && new Date(token.expiredAt).getTime() > Date.now(),
     * );
     *
     * if (oldAccessTokenToBeBlackListed) {
     * await this.generateBlacklistToken([oldAccessTokenToBeBlackListed], user.id);
     * }
     *
     */

    const token = await this.jwtTokenService.generateJwtToken(payload);

    return {
      tokenType: this.jwtConfig.getJwtType(),
      accessToken: token.token,
      accessTokenExpires: token.expiresAt,
    };
  }
}
