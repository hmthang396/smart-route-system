import { Global, Module } from "@nestjs/common";
import { UserAccountRepository } from "./user-account.repository";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { UserLoginDataRepository } from "./user-login-data.repository";
import { OutboxRepository } from "./outbox.repository";

@Module({
  imports: [TypeOrmConfigModule],
  providers: [UserAccountRepository, UserLoginDataRepository, OutboxRepository],
  exports: [UserAccountRepository, UserLoginDataRepository, OutboxRepository],
})
@Global()
export class RepositoriesModule {}
