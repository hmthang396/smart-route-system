import { Inject, Injectable, Logger } from "@nestjs/common";
import { UnitOfWork } from "../unit-of-work/unit-of-work.service";
import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class OutboxPoller {
  constructor(
    @Inject(UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    // private readonly messageBrokerService: MessageBrokerService, // For sending to RabbitMQ/Kafka
  ) {}

  @Cron("*/10 * * * * *")
  async processOutbox() {
    Logger.debug(`OutboxPoller run every 10 seconds`, "OutboxPoller");

    const pendingMessages = await this.unitOfWork.getOutboxRepository().findPendingMessages();

    for (const message of pendingMessages) {
      try {
        // Send the message to the message broker

        // Mark the message as 'SENT' in the outbox
        await this.unitOfWork.getOutboxRepository().markAsSent(message.uuid);
      } catch (error) {
        // Log the error and mark the message as 'FAILED' if needed
        console.error("Error sending message:", error);
        await this.unitOfWork.getOutboxRepository().markAsFailed(message.uuid);
      }
    }
  }
}
