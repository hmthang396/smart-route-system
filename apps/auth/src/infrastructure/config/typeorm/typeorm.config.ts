/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { SeederOptions } from "typeorm-extension";
dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // entities: ["./dist/apps/auth/apps/payments/src/domain/entities/*.entity.js"],
  entities: ["apps/auth/src/infrastructure/entities/*.entity.ts"],
  migrations: ["apps/auth/src/database/migrations/*.ts"],
  migrationsRun: false,
  logging: true,
  synchronize: false,
  migrationsTableName: "migrations",
};

const appDataSource = new DataSource(options);

export default appDataSource;
