class Logger {
  static instance: null | Logger = null;
  private logs: string[] = [];

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    Logger.instance = this;
    return Logger.instance;
  }

  log(message: string) {
    this.logs.push(message);
  }

  getLogs() {
    return this.logs.join(" | ");
  }
}

const logger1 = new Logger();
const logger2 = new Logger();

logger1.log("First log message");
logger2.log("Second log message");

console.log(logger1.getLogs());
console.log("---------devider---------");
console.log(logger2.getLogs());
