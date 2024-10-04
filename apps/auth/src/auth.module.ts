import { Module } from "@nestjs/common";
import { LocalStorageModule } from "./infrastructure/local-storage/local-storage.module";
import { RepositoriesModule } from "./infrastructure/repositories/repositories.module";
import { EnvironmentConfigModule, EnvironmentConfigService, ILogger, LoggerModule, LoggerService } from "@app/common";
import { ConfigService } from "@nestjs/config";
import { ControllerModule } from "./presentation/controllers/controller.module";
import { UnitOfWorkModule } from "./infrastructure/unit-of-work/unit-of-work.module";
import { JwtTokenModule } from "./infrastructure/services/jwt-token/jwt.module";
import { SubscriberModule } from "./infrastructure/subscribers/subcriber.module";
import { PollerModule } from "./infrastructure/pollers/poller.module";

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule.forRoot({
      envFilePath: ["./apps/auth/.env"],
      isGlobal: true,
    }),
    UnitOfWorkModule,
    LocalStorageModule,
    RepositoriesModule,
    ControllerModule,
    JwtTokenModule,
    SubscriberModule,
    PollerModule,
  ],
  controllers: [],
  providers: [EnvironmentConfigService],
  exports: [],
})
export class AuthModule {
  static port: number;
  static apiVersion: string;
  static apiPrefix: string;
  static logger: ILogger;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    AuthModule.logger = logger;
    AuthModule.port = +this.configService.get("API_PORT");
    AuthModule.apiVersion = this.configService.get("API_VERSION");
    AuthModule.apiPrefix = this.configService.get("API_PREFIX");
  }
}
