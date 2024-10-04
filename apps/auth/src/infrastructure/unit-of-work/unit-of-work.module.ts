import { Global, Module } from "@nestjs/common";
import { UnitOfWork } from "./unit-of-work.service";

@Module({
  imports: [],
  exports: [UnitOfWork],
  providers: [UnitOfWork],
})
@Global()
export class UnitOfWorkModule {}
