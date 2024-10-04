import { DatabaseConfig, JWTConfig } from "@app/common/configurations";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig {
  constructor(private configService: ConfigService) {}
  // Config ENV JWT
  getJwtSecret(): string {
    return this.configService.get<string>("ACCESS_TOKEN_SECRET");
  }
  getJwtExpirationTime(): number {
    return parseInt(this.configService.get<string>("ACCESS_TOKEN_EXPIRES_IN"));
  }
  getJwtRefreshSecret(): string {
    return this.configService.get<string>("REFRESH_TOKEN_SECRET");
  }
  getJwtRefreshExpirationTime(): number {
    return parseInt(this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN"));
  }
  getJwtType(): string {
    return this.configService.get<string>("TOKEN_TYPE");
  }
  getJwtPasswordExpirationTime(): number {
    return parseInt(this.configService.get<string>("RESET_PASSWORD_LINK_EXPIRES_IN"));
  }
  getJwtPasswordSecret(): string {
    return this.configService.get<string>("RESET_PASSWORD_SECRET");
  }
  getJwtRefreshCookieKey(): string {
    return this.configService.get<string>("REFRESH_TOKEN_COOKIE_KEY");
  }
  getJwtRefreshTokenCookieMaxAge(): string {
    return this.configService.get<string>("REFRESH_TOKEN_COOKIE_MAX_AGE");
  }
  getJwtVerifySecret(): string {
    return this.configService.get<string>("VERIFY_SECRET");
  }
  getJwtVerifyExpirationTime(): number {
    return parseInt(this.configService.get<string>("VERIFY_EXPIRES_IN"));
  }

  // Config ENV database
  getDatabaseHost(): string {
    return this.configService.get<string>("DB_HOST");
  }
  getDatabasePort(): number {
    return parseInt(this.configService.get<string>("DB_PORT"));
  }
  getDatabaseUser(): string {
    return this.configService.get<string>("DB_USERNAME");
  }
  getDatabasePassword(): string {
    return this.configService.get<string>("DB_PASSWORD");
  }
  getDatabaseName(): string {
    return this.configService.get<string>("DB_DATABASE");
  }
  getDatabaseSchema(): string {
    return this.configService.get<string>("DB_SCHEMA");
  }
}
