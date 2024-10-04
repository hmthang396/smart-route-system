import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UnitOfWorkModule } from "../../unit-of-work/unit-of-work.module";
import { JwtTokenService } from "./jwt.service";

@Module({
  imports: [JwtModule, UnitOfWorkModule],
  providers: [
    JwtTokenService,
    // {
    //   inject: [UserAccountRepository, EnvironmentConfigService],
    //   provide: JwtStrategy,
    //   useFactory: (userAccountRepository: UserAccountRepository, config: JWTConfig) =>
    //     new JwtStrategy(userAccountRepository, config),
    // },
    // {
    //   inject: [UserAccountRepository, JwtTokenService, EnvironmentConfigService],
    //   provide: JwtRefreshTokenStrategy,
    //   useFactory: (
    //     userAccountRepository: UserAccountRepository,
    //     jwtTokenSerivce: JwtTokenService,
    //     config: EnvironmentConfigService,
    //   ) => new JwtRefreshTokenStrategy(userAccountRepository, jwtTokenSerivce, config),
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [JwtTokenService],
})
@Global()
export class JwtTokenModule {}
