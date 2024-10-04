import { Outbox } from "@app/common";

export interface IOutboxRepository {
  createOutbox(outbox: Partial<Outbox>): Promise<Outbox>;
  findByUUID(uuid: string): Promise<Outbox>;
  findPendingMessages(): Promise<Outbox[]>;
  markAsSent(uuid: string): Promise<void>;
  markAsFailed(uuid: string): Promise<void>;
}
