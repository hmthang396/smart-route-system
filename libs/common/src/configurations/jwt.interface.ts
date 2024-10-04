export interface JWTConfig {
  getJwtType(): string;
  getJwtSecret(): string;
  getJwtExpirationTime(): number;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): number;
  getJwtPasswordSecret(): string;
  getJwtPasswordExpirationTime(): number;
  getJwtVerifySecret(): string;
  getJwtVerifyExpirationTime(): number;
  //
  getJwtRefreshCookieKey(): string;
  getJwtRefreshTokenCookieMaxAge(): string;
}
