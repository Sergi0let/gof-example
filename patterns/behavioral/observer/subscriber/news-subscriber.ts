// ====== Observer Pattern ======

// Publisher is the object that is being observed.
class Publisher {
  private subscribers: ISubscriberSimple[] = [];

  add(subscriber: ISubscriberSimple) {
    this.subscribers.push(subscriber);
    return this;
  }

  remove(subscriber: ISubscriberSimple) {
    if (!this.subscribers.includes(subscriber)) {
      console.log(`Subscriber ${subscriber.getName()} not found`);
      return this;
    }
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    return this;
  }

  notify(news: string) {
    if (this.subscribers.length === 0) {
      console.log("No subscribers to notify");
      return;
    }
    this.subscribers.forEach((subscriber) => {
      subscriber.update(news);
    });
  }
}

// Subscriber is the object that is observing the publisher.
interface ISubscriberSimple {
  update(news: string): void;
  getName(): string;
}

// ConcreteSubscriber is the object that is observing the publisher.
class NewsSubscriber implements ISubscriberSimple {
  public newsHistory: string[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  update(news: string) {
    console.log(`${this.name} received news: ${news}`);
    this.newsHistory.push(news);
    return this;
  }

  getNewsHistory() {
    console.log(`${this.name} news history: ${this.newsHistory.join(", ")}`);
    return [...this.newsHistory];
  }
}

const publisher = new Publisher();
const subscriber1 = new NewsSubscriber("Subscriber 1");
const subscriber2 = new NewsSubscriber("Subscriber 2");

publisher.add(subscriber1).add(subscriber2);

publisher.notify("New news: Breaking 1 from Ukraine");
publisher.notify("New news: Breaking 2 from Ukraine");

publisher.remove(subscriber1);

publisher.notify("New news: Breaking 3 from Ukraine");

subscriber1.getNewsHistory();
subscriber2.getNewsHistory();
