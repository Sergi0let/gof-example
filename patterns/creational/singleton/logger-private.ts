class LoggerPrivate {
  static instance: null | LoggerPrivate = null;
  private logs: string[] = [];

  private constructor() {
    this.logs = [];
  }

  //   private — до instance можна звертатися тільки всередині класу (наприклад, у getInstance()).
  // static — одна спільна змінна на весь клас, не своя копія в кожному екземплярі.
  public static getInstance(): LoggerPrivate {
    if (!LoggerPrivate.instance) {
      LoggerPrivate.instance = new LoggerPrivate();
    }
    return LoggerPrivate.instance;
  }

  log(message: string) {
    this.logs.push(message);
  }

  getLogs() {
    return this.logs.join(" | ");
  }
}

const LoggerPrivate1 = LoggerPrivate.getInstance();
const LoggerPrivate2 = LoggerPrivate.getInstance();

LoggerPrivate1.log("First log message");
LoggerPrivate2.log("Second log message");

console.log(LoggerPrivate1.getLogs());
console.log("---------devider---------");
console.log(LoggerPrivate2.getLogs());
