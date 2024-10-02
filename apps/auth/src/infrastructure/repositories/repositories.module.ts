import { Global, Module } from "@nestjs/common";
import { UserAccountRepository } from "./user-account.repository";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { UserLoginDataRepository } from "./user-login-data.repository";

@Module({
  imports: [TypeOrmConfigModule],
  providers: [UserAccountRepository, UserLoginDataRepository],
  exports: [UserAccountRepository, UserLoginDataRepository],
})
@Global()
export class RepositoriesModule {}
