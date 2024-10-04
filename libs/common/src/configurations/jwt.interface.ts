export interface JWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): number;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): number;
  getJwtType(): string;
  getJwtPasswordExpirationTime(): number;
  getJwtPasswordSecret(): string;
  getJwtRefreshCookieKey(): string;
  getJwtRefreshTokenCookieMaxAge(): string;
}
