interface ILoggerNew {
  log(msg: string): void
}
interface ILoggerOld {
  show(msg: string): void
}

class LoggerNew implements ILoggerNew {
  log(msg: string): void {
    console.log(msg)
  }
}

class LoggerOld implements ILoggerOld {
    show(msg: string): void {
      console.log(msg)
    }
}

class AdapterLogger {
  private currentLogger: ILoggerOld 

  constructor(currentLogger: ILoggerOld) {
    this.currentLogger = currentLogger
  } 

  public log(msg: string) {
    this.currentLogger.show(msg)
  }
}

const adapterLogger = new AdapterLogger(new LoggerOld());
const loggerNew = new LoggerNew()
const loggerOld = new LoggerOld();

adapterLogger.log('adapter logger')
loggerNew.log('logger new')
loggerOld.show('show logger old')