import { ITokenDto, TokenType, UserAccount } from "@app/common";

export interface JwtPayload {
  uuid: string;
  hasVerify2FA: boolean;
}

export interface IJwtService {
  checkToken(token: string, type: TokenType): Promise<JwtPayload | Partial<JwtPayload>>;

  createToken(payload: any, secret: string, expiresIn: number, algorithm: string): Promise<[string, number]>;

  isTokenBlacklist(token: string): Promise<boolean>;

  responseAuthWithToken(
    userAccount: UserAccount,
    hasVerify2FA?: boolean,
  ): Promise<{ user: UserAccount; token: ITokenDto }>;

  generateJwtToken(payload: JwtPayload): Promise<{ token: string; expiresAt: number }>;

  generateJwtRefreshToken(payload: JwtPayload): Promise<{ token: string; expiresAt: number }>;

  generatePasswordRecoveryToken(uuid: string): Promise<{
    token: string;
    expiresAt: number;
  }>;

  generateConfirmationToken(uuid: string): Promise<{
    token: string;
    expiresAt: number;
  }>;
}
