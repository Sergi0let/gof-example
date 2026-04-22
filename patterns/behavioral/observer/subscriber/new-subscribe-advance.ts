// =================================================================
// Observer Pattern — розширена версія
//
// Реальний кейс: OrderStore (Publisher) змінює статус замовлення.
// Різні системи (Email, Log, Analytics) реагують автоматично —
// OrderStore нічого про них не знає.
//
// Without Observer: OrderStore сам викликає email, log, analytics —
//   тісна залежність, важко додати нову реакцію.
// With Observer: кожна система підписується сама —
//   OrderStore не змінюється при додаванні нових підписників.
// =================================================================

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";

interface OrderEvent {
  orderId: string;
  status: OrderStatus;
  payload?: Record<string, unknown>;
}

// Contract every subscriber must fulfill
interface ISubscriber<T> {
  update(event: T): void;
  getName(): string;
}

// =================================================================
// PUBLISHER — holds state, notifies on change
//
// Key rule: Publisher depends only on ISubscriber<T>,
// never on EmailService, Logger, or Analytics directly.
// =================================================================
class OrderStore {
  private subscribers: ISubscriber<OrderEvent>[] = [];
  private status: OrderStatus = "pending";

  // --- subscription management ---

  subscribe(subscriber: ISubscriber<OrderEvent>) {
    this.subscribers.push(subscriber);
    return this;
  }

  unsubscribe(subscriber: ISubscriber<OrderEvent>) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    return this;
  }

  // --- state change triggers notification ---

  setStatus(orderId: string, status: OrderStatus) {
    this.status = status;

    // Notify all subscribers about the state change
    this.notify({ orderId, status });
  }

  private notify(event: OrderEvent) {
    if (this.subscribers.length === 0) {
      console.warn("No subscribers — event dropped:", event);
      return;
    }
    // Publisher has no idea what subscribers DO with the event
    this.subscribers.forEach((s) => s.update(event));
  }
}

// =================================================================
// CONCRETE SUBSCRIBERS
// Each reacts to the same event differently — Publisher doesn't care.
// Adding a new subscriber = zero changes to OrderStore.
// =================================================================

// Sends confirmation email on specific statuses
class EmailService implements ISubscriber<OrderEvent> {
  getName() {
    return "EmailService";
  }

  update(event: OrderEvent) {
    const templates: Partial<Record<OrderStatus, string>> = {
      confirmed: `Order ${event.orderId} confirmed — preparing your package.`,
      shipped: `Order ${event.orderId} is on its way!`,
      delivered: `Order ${event.orderId} delivered. Enjoy!`,
    };

    const template = templates[event.status];
    if (template) {
      console.log(`[Email] → ${template}`);
    }
    // Ignores "pending" — no email needed at that stage
  }
}

// Logs every status change for debugging
class AuditLogger implements ISubscriber<OrderEvent> {
  private log: OrderEvent[] = [];

  getName() {
    return "AuditLogger";
  }

  update(event: OrderEvent) {
    const entry = { ...event, timestamp: new Date().toISOString() };
    this.log.push(entry);
    console.log(`[Log] ${entry.timestamp} | order=${event.orderId} status=${event.status}`);
  }

  getLog() {
    return [...this.log];
  }
}

// Tracks conversion funnel — only cares about final statuses
class Analytics implements ISubscriber<OrderEvent> {
  private delivered = 0;

  getName() {
    return "Analytics";
  }

  update(event: OrderEvent) {
    if (event.status === "delivered") {
      this.delivered++;
      console.log(`[Analytics] delivered count: ${this.delivered}`);
    }
    // Ignores all other statuses — its own concern, not Publisher's
  }
}

// =================================================================
// USAGE
// =================================================================

const store = new OrderStore();
const email = new EmailService();
const logger = new AuditLogger();
const analytics = new Analytics();

// Each subscriber registers itself — OrderStore doesn't know who
store.subscribe(email).subscribe(logger).subscribe(analytics);

// One state change → all three react automatically
store.setStatus("ORD-001", "confirmed");
// [Email]     → Order ORD-001 confirmed — preparing your package.
// [Log]       → 2024-... | order=ORD-001 status=confirmed
// (Analytics) → ignores confirmed

store.setStatus("ORD-001", "shipped");
// [Email]     → Order ORD-001 is on its way!
// [Log]       → 2024-... | order=ORD-001 status=shipped
// (Analytics) → ignores shipped

// Unsubscribe email — stops getting notifications, others unaffected
store.unsubscribe(email);

store.setStatus("ORD-001", "delivered");
// (Email)     → unsubscribed, gets nothing
// [Log]       → 2024-... | order=ORD-001 status=delivered
// [Analytics] → delivered count: 1

// Check what logger collected independently
console.log("Full audit log:", logger.getLog());
