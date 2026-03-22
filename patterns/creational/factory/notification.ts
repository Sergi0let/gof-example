// =================================================================
// PATTERN: Simple Factory + Strategy
//
// Factory  — decides WHICH notification object to create
// Strategy — decides WHERE the output goes (console / array / remote)
//
// Flow:
//   FactoryNotify.create(type, logger?)
//       └─► new XxxNotify(logger?)
//               └─► BaseNotify.show()
//                       └─► logger.log(output)   ← Strategy in action
// =================================================================

// -----------------------------------------------------------------
// STRATEGY — logger interface + concrete implementations
//
// To add a new destination: implement ILoggerStrategy, pass it to create().
// BaseNotify never changes — it only depends on the interface.
// -----------------------------------------------------------------

interface ILoggerStrategy {
  log(output: string): void;
}

// Destination: stdout
class ConsoleLogger implements ILoggerStrategy {
  log(output: string) {
    console.log(output);
  }
}

// Destination: in-memory array (handy for tests or batch display)
class ArrayLogger implements ILoggerStrategy {
  private entries: string[] = [];

  log(output: string) {
    this.entries.push(output);
  }

  showAll(): void {
    console.log("ArrayLogger entries:", this.entries);
  }
}

// Destination: remote HTTP endpoint
class RemoteLogger implements ILoggerStrategy {
  constructor(private readonly url: string) {}

  log(output: string) {
    console.log("RemoteLogger →", this.url, JSON.stringify(output));
    // fetch(this.url, { method: "POST", body: JSON.stringify({ message: output }) });
  }
}

// Used when no logger is passed to FactoryNotify.create()
const DEFAULT_LOGGER: ILoggerStrategy = new ConsoleLogger();

// -----------------------------------------------------------------
// FACTORY — notification types + base class + concrete subclasses
// -----------------------------------------------------------------

type NotifyType = "success" | "pending" | "error" | "info";

interface INotify {
  show(msg?: string): void;
}

// Shared formatting logic.
// Subclasses only pin their own (text, type) via super() — nothing else.
abstract class BaseNotify implements INotify {
  // Allocated once per class, not per instance
  private static readonly icons: Record<NotifyType, string> = {
    success: "✓",
    error: "✕",
    pending: "!",
    info: "i",
  };

  constructor(
    protected readonly text: string,
    protected readonly type: NotifyType,
    // ← Strategy injected here; swap the logger without touching this class
    private readonly logger: ILoggerStrategy = DEFAULT_LOGGER
  ) {}

  show(message?: string): void {
    const timestamp = new Date().toISOString();
    const icon = BaseNotify.icons[this.type];
    const output = `[${timestamp}] [${icon}] ${this.type.toUpperCase()}: ${this.text} | ${message ?? "no message"}`;

    this.logger.log(output); // delegate output — Strategy pattern
  }
}

// Each subclass owns only its fixed text + type.
// The logger is forwarded to BaseNotify unchanged.
class SuccessNotify extends BaseNotify {
  constructor(logger?: ILoggerStrategy) {
    super("Operation completed successfully", "success", logger);
  }
}

class ErrorNotify extends BaseNotify {
  constructor(logger?: ILoggerStrategy) {
    super("Something went wrong", "error", logger);
  }
}

class WarningNotify extends BaseNotify {
  constructor(logger?: ILoggerStrategy) {
    super("Please pay attention", "pending", logger);
  }
}

class InfoNotify extends BaseNotify {
  constructor(logger?: ILoggerStrategy) {
    super("Here is some information", "info", logger);
  }
}

// The only place that knows which class maps to which type.
// Adding a new type = one new subclass + one new line in the map.
export class FactoryNotify {
  static create(type: NotifyType, logger?: ILoggerStrategy): BaseNotify {
    const map: Record<NotifyType, () => BaseNotify> = {
      success: () => new SuccessNotify(logger),
      error: () => new ErrorNotify(logger),
      pending: () => new WarningNotify(logger),
      info: () => new InfoNotify(logger),
    };

    const creator = map[type];
    if (!creator) throw new globalThis.Error(`Unknown notification type: "${type}"`);
    return creator();
  }
}

// -----------------------------------------------------------------
// USAGE
// -----------------------------------------------------------------

const arrayLogger = new ArrayLogger();
const remoteLogger = new RemoteLogger("https://logs.example.com/api");

FactoryNotify.create("success", arrayLogger).show("First"); // → ArrayLogger
FactoryNotify.create("error").show("Second"); // → ConsoleLogger (default)
FactoryNotify.create("pending", remoteLogger).show("Third"); // → RemoteLogger

arrayLogger.showAll(); // print everything collected so far
