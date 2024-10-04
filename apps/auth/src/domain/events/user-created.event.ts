import { DomainEvent } from "@app/auth/common/event";

export class UserCreatedEvent extends DomainEvent {
  private id: string;

  constructor() {
    super();
  }

  // Implement the getAggregateId method to return the ID of the order aggregate
  public getAggregateId(): string {
    return this.id;
  }
}
