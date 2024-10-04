import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TimestampEntity } from "./timestamp.entity";
import { Outbox, OutboxStatus } from "@app/common";

@Entity({ name: "outbox" })
export class OutboxEntity extends TimestampEntity implements Outbox {
  // Constructor
  constructor(outboxEntity?: Partial<OutboxEntity>) {
    super();
    Object.assign(this, outboxEntity);
  }
  @PrimaryGeneratedColumn({ name: "outbox_id", type: "bigint" })
  outboxId: number;

  @Column({ name: "uuid", type: "uuid", generated: "uuid" })
  uuid: string; // Unique ID for the outbox message

  @Column({
    name: "event_type",
    type: "varchar",
    length: 255,
    nullable: true,
    default: null,
  })
  eventType: string; // Type of the event

  @Column({
    name: "payload",
    type: "jsonb",
  })
  payload: Record<string, any>; // The event data to be sent, stored as JSONB for flexibility

  @Column({
    name: "status",
    type: "enum",
    enum: OutboxStatus,
    nullable: false,
    default: OutboxStatus.PENDING,
  })
  status: OutboxStatus; // Status of the message (PENDING, SENT, FAILED)

  @Column({
    name: "sent_at",
    type: "timestamp",
    nullable: true,
    default: null,
  })
  sentAt: Date; // When the event was sent (NULL if not sent yet)

  @Column({
    name: "retry_count",
    type: "int",
    default: 0,
  })
  retryCount: number; // Number of retries for sending the event

  //
  toModel(): Outbox {
    const outbox = new Outbox();

    outbox.outboxId = this.outboxId;
    outbox.uuid = this.uuid;
    outbox.eventType = this.eventType;
    outbox.payload = this.payload;
    outbox.status = this.status;
    outbox.sentAt = this.sentAt;
    outbox.retryCount = this.retryCount;

    return outbox;
  }
}
