interface Observer<T> {
  next(value: T): void;
  complete(): void;
}

interface Provider<T> {
  start(observer: Observer<T>): void;
  stop(): void;
}

class Subscription<T> {
  constructor(
    private observable: Observable<T>,
    private observer: Observer<T>
  ) {}

  unsubscribe() {
    this.observable.removeObserver(this.observer);
  }
}

export class Observable<T> implements Observer<T> {
  private observers: Observer<T>[] = [];

  constructor(private producer: Provider<T>) {}

  next(value: T): void {
    for (const observer of this.observers) {
      observer.next(value);
    }
  }

  complete(): void {
    const observers = this.observers;
    this.observers = [];
    this.producer.stop();
    for (const observer of observers) {
      observer.complete();
    }
  }

  subscribe(observer: Observer<T>): Subscription<T> {
    this.addObserver(observer);

    if (this.observers.length === 1) {
      this.producer.start(this);
    }

    return new Subscription(this, observer);
  }

  addObserver(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);

    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
}
