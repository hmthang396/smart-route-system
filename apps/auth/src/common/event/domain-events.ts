export abstract class DomainEvent {
  public readonly occurredOn: Date;

  constructor() {
    this.occurredOn = new Date();
  }

  /**
   * Returns the name of the event class.
   * Subclasses should override this if necessary.
   */
  public getEventName(): string {
    return this.constructor.name;
  }

  /**
   * Abstract method to provide the aggregate ID related to the event.
   * Subclasses must implement this method to return the ID of the aggregate
   * or entity related to the domain event.
   */
  public abstract getAggregateId(): string;
}
