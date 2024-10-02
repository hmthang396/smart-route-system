import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "../../local-storage/local-storage.module";
import { DatabaseConfig, EnvironmentConfigModule, EnvironmentConfigService } from "@app/common";

export const getTypeOrmModuleOptions = (config: DatabaseConfig): TypeOrmModuleOptions =>
  ({
    type: "postgres",
    entities: ["apps/auth/src/infrastructure/entities/*.entity.ts"],
    logging: true,
    synchronize: false,
    migrationsRun: false,

    schema: config.getDatabaseSchema(),
    migrations: ["apps/auth/src/infrastructure/database/migrations/*.ts"],
    migrationsTableName: "migrations",
    seedTracking: true,
    replication: {
      master: {
        host: config.getDatabaseHost(),
        port: config.getDatabasePort(),
        username: config.getDatabaseUser(),
        password: config.getDatabasePassword(),
        database: config.getDatabaseName(),
      },
      slaves: [
        {
          host: config.getDatabaseHost(),
          port: config.getDatabasePort(),
          username: config.getDatabaseUser(),
          password: config.getDatabasePassword(),
          database: config.getDatabaseName(),
        },
      ],
    },
    seeds: ["dist/database/seeds/**/*{.ts,.js}"],
    factories: ["dist/database/factories/**/*{.ts,.js}"],
    autoLoadEntities: true,
  }) as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        EnvironmentConfigModule.forRoot({
          envFilePath: ["./apps/auth/.env"],
          isGlobal: false,
        }),
      ],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
      dataSourceFactory: async (options) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([
      // ...
    ]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
