import { OutboxStatus } from "../enums";

export class Outbox {
  constructor(data?: Partial<Outbox>) {
    Object.assign(this, { ...data });
  }

  outboxId: number;
  uuid: string;
  eventType: string;
  payload: Record<string, any>;
  status: OutboxStatus;
  sentAt: Date;
  retryCount: number;
}
