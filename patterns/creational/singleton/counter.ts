class Counter {
  static instance: null | Counter = null;
  private count: number = 0;

  constructor() {
    if (Counter.instance) {
      return Counter.instance;
    }

    Counter.instance = this;
    return Counter.instance;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  getCount() {
    return this.count;
  }
}

const counter1 = new Counter();
const counter2 = new Counter();

counter1.increment();

counter2.increment();
counter2.increment();

console.log(counter1.getCount());
console.log(counter2.getCount());
