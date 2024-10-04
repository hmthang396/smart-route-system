import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { OutboxEntity } from "../entities";
import { InjectConnection } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";

@EventSubscriber()
export class OutboxSubscriber implements EntitySubscriberInterface<OutboxEntity> {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return OutboxEntity;
  }

  /**
   * Called after an OutboxEntity is inserted into the database.
   */
  async afterInsert(event: InsertEvent<OutboxEntity>): Promise<void> {
    Logger.debug(`after an OutboxEntity is inserted into the database: ${event.entity.outboxId}`, "OutboxSubscriber");
    await this.publishEvent(event.entity);
  }

  /**
   * Publishes the event via the message broker and marks it as processed.
   */
  private async publishEvent(outboxEntity: OutboxEntity): Promise<void> {
    try {
      // Dispatch the event to the message broker (RabbitMQ, Kafka, etc.)
    } catch (error) {
      // Optionally, implement retry logic or error handling.
    }
  }
}
