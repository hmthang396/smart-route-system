import { IJwtService, JwtPayload } from "@app/auth/domain/adapters";
import { EnvironmentConfigService, ITokenDto, JWTConfig, TokenDto, TokenType, UserAccount } from "@app/common";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UnitOfWork } from "../../unit-of-work/unit-of-work.service";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(EnvironmentConfigService)
    private readonly jwtConfig: JWTConfig,
  ) {}
  async generatePasswordRecoveryToken(uuid: string) {
    const secret = await this.jwtConfig.getJwtPasswordSecret();

    const expires = this.jwtConfig.getJwtPasswordExpirationTime();

    const [token, expiresAt] = await this.createToken({ uuid }, secret, expires);

    return { token, expiresAt };
  }

  async checkToken(token: string, type: TokenType): Promise<JwtPayload | Partial<JwtPayload>> {
    return await this.jwtService.verifyAsync(token, {
      algorithms: type === TokenType.ResetPasswordToken ? ["HS256"] : ["HS512"],
      secret:
        type === TokenType.AccessToken
          ? this.jwtConfig.getJwtSecret()
          : type === TokenType.RefreshToken
            ? this.jwtConfig.getJwtRefreshSecret()
            : this.jwtConfig.getJwtPasswordSecret(),
    });
  }

  async createToken(payload: any, secret: string, expiresIn: number): Promise<[string, number]> {
    const token = await this.jwtService.sign(payload, {
      secret,
      expiresIn,
      algorithm: "HS512",
    });

    return [token, this.getTokenExpiration(expiresIn)];
  }

  isTokenBlacklist(token: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async responseAuthWithToken(
    userAccount: UserAccount,
    hasVerify2FA?: boolean,
  ): Promise<{ user: UserAccount; token: ITokenDto }> {
    const token: TokenDto = await this.generateTokens(userAccount, hasVerify2FA);
    // Update new token in to DB
    // await this.updateOrCreateTokens(userAccount, token);

    return {
      user: userAccount,
      token,
    };
  }

  private async generateTokens(userAccount: UserAccount, hasVerify2FA: boolean = false): Promise<TokenDto> {
    const payload: JwtPayload = {
      uuid: userAccount.uuid,
      hasVerify2FA,
    };
    const tokenType = this.jwtConfig.getJwtType();

    const [accessToken, refreshToken] = await Promise.all([
      this.generateJwtToken(payload),
      this.generateJwtRefreshToken(payload),
    ]);

    return {
      tokenType,
      accessToken: accessToken.token,
      accessTokenExpires: accessToken.expiresAt,
      refreshToken: refreshToken.token,
      refreshTokenExpires: refreshToken.expiresAt,
    };
  }

  async generateJwtToken(payload: JwtPayload): Promise<{ token: string; expiresAt: number }> {
    const accessTokenSecret = await this.jwtConfig.getJwtSecret();
    const expires = this.jwtConfig.getJwtExpirationTime();
    const [token, expiresAt] = await this.createToken(payload, accessTokenSecret, expires);

    return { token, expiresAt };
  }

  async generateJwtRefreshToken(payload: JwtPayload) {
    const refreshTokenSecret = await this.jwtConfig.getJwtRefreshSecret();
    const expires = this.jwtConfig.getJwtRefreshExpirationTime();
    const [token, expiresAt] = await this.createToken(payload, refreshTokenSecret, expires);

    return { token, expiresAt };
  }

  private getTokenExpiration(duration: number) {
    return Math.floor(Date.now() / 1000) + duration;
  }
}
