export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly products: any[],
    public readonly timestamp: Date,
  ) {}
}

export class OrderUpdatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly changes: any,
    public readonly timestamp: Date,
  ) {}
}

export class OrderCancelledEvent {
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}
