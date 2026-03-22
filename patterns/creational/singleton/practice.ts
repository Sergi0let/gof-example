class MyLogger {
  private messages: Array<{ id: string; message: string }> = [];
  static instance: MyLogger | null = null;

  private constructor() {}

  log(message: string) {
    this.messages.push({ id: new Date().toTimeString(), message });
    return this;
  }

  getMessages() {
    console.log(this.messages);
    return this;
  }

  static getInstance() {
    if (!MyLogger.instance) {
      MyLogger.instance = new MyLogger();
    }
    return MyLogger.instance;
  }
}

// const log1 = new MyLogger();
// // const log1 = new MyLogger();
const log1 = MyLogger.getInstance();
const log2 = MyLogger.getInstance();

log1.log("One").log("Two");
log2.log("Three").log("Four");

log1.getMessages();
log2.getMessages();
