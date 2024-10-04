import { IJwtService, JwtPayload } from "@app/auth/domain/adapters";
import { EnvironmentConfigService, ITokenDto, JWTConfig, TokenDto, TokenType, UserAccount } from "@app/common";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UnitOfWork } from "../../unit-of-work/unit-of-work.service";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { Algorithm } from "jsonwebtoken";
@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(EnvironmentConfigService)
    private readonly jwtConfig: JWTConfig,
  ) {}
  async createToken(payload: any, secret: string, expiresIn: number, algorithm: string): Promise<[string, number]> {
    const token = await this.jwtService.sign(payload, {
      secret,
      expiresIn,
      algorithm: algorithm as Algorithm,
    });
    return [token, this.getTokenExpiration(expiresIn)];
  }

  async checkToken(token: string, type: TokenType): Promise<JwtPayload | Partial<JwtPayload>> {
    const secret = this.getSecretByTokenType(type);
    const algorithm = this.getAlgorithmsByTokenType(type);

    return await this.jwtService.verifyAsync(token, {
      algorithms: [algorithm],
      secret,
    });
  }

  async isTokenBlacklist(token: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async responseAuthWithToken(
    userAccount: UserAccount,
    hasVerify2FA?: boolean,
  ): Promise<{ user: UserAccount; token: ITokenDto }> {
    const token: TokenDto = await this.generateTokens(userAccount, hasVerify2FA);
    // Update new token in to DB
    // await this.updateOrCreateTokens(userAccount, token);

    return { user: userAccount, token };
  }

  async generatePasswordRecoveryToken(uuid: string) {
    return this.generateToken({ uuid }, TokenType.ResetPasswordToken);
  }

  async generateConfirmationToken(uuid: string) {
    return this.generateToken({ uuid }, TokenType.VerifyAccountToken);
  }

  async generateJwtToken(payload: JwtPayload): Promise<{ token: string; expiresAt: number }> {
    return this.generateToken(payload, TokenType.AccessToken);
  }

  async generateJwtRefreshToken(payload: JwtPayload) {
    return this.generateToken(payload, TokenType.RefreshToken);
  }

  private async generateToken(payload: any, type: TokenType) {
    const secret = this.getSecretByTokenType(type);
    const expires = this.getTokenExpirationByTokenType(type);
    const algorithm = this.getAlgorithmsByTokenType(type);

    const [token, expiresAt] = await this.createToken(payload, secret, expires, algorithm);

    return { token, expiresAt };
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

  private getTokenExpiration(duration: number) {
    return Math.floor(Date.now() / 1000) + duration;
  }

  private getTokenExpirationByTokenType(type: TokenType): number {
    switch (type) {
      case TokenType.AccessToken:
        return this.jwtConfig.getJwtExpirationTime();
      case TokenType.RefreshToken:
        return this.jwtConfig.getJwtRefreshExpirationTime();
      case TokenType.ResetPasswordToken:
        return this.jwtConfig.getJwtPasswordExpirationTime();
      case TokenType.VerifyAccountToken:
        return this.jwtConfig.getJwtVerifyExpirationTime();
      default:
        throw new Error("Invalid token type");
    }
  }

  private getAlgorithmsByTokenType(type: TokenType): Algorithm {
    if (type === TokenType.ResetPasswordToken || type === TokenType.VerifyAccountToken) {
      return "HS256";
    }
    return "HS512";
  }

  private getSecretByTokenType(type: TokenType): string {
    switch (type) {
      case TokenType.AccessToken:
        return this.jwtConfig.getJwtSecret();
      case TokenType.RefreshToken:
        return this.jwtConfig.getJwtRefreshSecret();
      case TokenType.ResetPasswordToken:
        return this.jwtConfig.getJwtPasswordSecret();
      case TokenType.VerifyAccountToken:
        return this.jwtConfig.getJwtVerifySecret();
      default:
        throw new Error("Invalid token type");
    }
  }
}
