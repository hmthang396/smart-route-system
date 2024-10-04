import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "../../local-storage/local-storage.module";
import { DatabaseConfig, EnvironmentConfigService } from "@app/common";
import { UserAccountEntity, UserLoginDataEntity } from "../../entities";

export const getTypeOrmModuleOptions = (config: DatabaseConfig): TypeOrmModuleOptions =>
  ({
    type: "postgres",
    entities: ["dist/apps/auth/src/infrastructure/entities/*.entity.js"],
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
    autoLoadEntities: false,
  }) as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
      dataSourceFactory: async (options) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([UserAccountEntity, UserLoginDataEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
