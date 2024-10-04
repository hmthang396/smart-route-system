import { Module } from "@nestjs/common";
import { OutboxPoller } from "./outbox.poller";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [OutboxPoller],
  exports: [OutboxPoller],
})
export class PollerModule {}
