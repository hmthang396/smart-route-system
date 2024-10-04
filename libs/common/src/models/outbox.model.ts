export class Outbox {
  constructor(data?: Partial<Outbox>) {
    Object.assign(this, { ...data });
  }

  id: number;
  payload: Record<string, any>;
  processed: boolean;
}
