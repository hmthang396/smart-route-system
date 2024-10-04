import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvironmentConfigService } from "./environment-config.service";

export interface EnvironmentConfigOptions {
  envFilePath: string[];
  isGlobal: boolean;
}

@Module({})
export class EnvironmentConfigModule {
  static forRoot(options: EnvironmentConfigOptions): DynamicModule {
    return {
      module: EnvironmentConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: options.envFilePath,
          isGlobal: options.isGlobal,
        }),
      ],
      providers: [EnvironmentConfigService],
      exports: [EnvironmentConfigService],
      global: options.isGlobal,
    };
  }
}
