import { Module } from "@nestjs/common";
import { LocalStorageModule } from "./infrastructure/local-storage/local-storage.module";
import { RepositoriesModule } from "./infrastructure/repositories/repositories.module";
import { EnvironmentConfigModule, EnvironmentConfigService, ILogger, LoggerModule, LoggerService } from "@app/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmConfigModule } from "./infrastructure/config/typeorm/typeorm.module";

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule.forRoot({
      envFilePath: ["./apps/auth/.env"],
      isGlobal: true,
    }),
    TypeOrmConfigModule,
    LocalStorageModule,
    RepositoriesModule,
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
