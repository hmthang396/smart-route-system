import { Module } from "@nestjs/common";
import { OutboxSubscriber } from "./outbox.subscriber";

@Module({
  imports: [],
  providers: [OutboxSubscriber],
  exports: [OutboxSubscriber],
})
export class SubscriberModule {}
