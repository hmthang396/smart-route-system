import { Global, Module } from "@nestjs/common";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { RepositoriesModule } from "../repositories/repositories.module";
import { UnitOfWork } from "./unit-of-work.service";

@Module({
  imports: [TypeOrmConfigModule, RepositoriesModule],
  exports: [UnitOfWork],
  providers: [UnitOfWork],
})
@Global()
export class UnitOfWorkModule {}
