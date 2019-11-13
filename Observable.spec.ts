import { Observable } from "./Observable";

describe("Observable", () => {
  test("should emit synchronously", () => {
    const observable = new Observable<number>({
      start(observer) {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
      },
      stop() {}
    });

    const emitted: number[] = [];
    const subscription = observable.subscribe({
      next(value) {
        emitted.push(value);
      },
      complete() {
        emitted.push(-1);
      }
    });
    observable.next(5);
    subscription.unsubscribe();

    expect(emitted).toEqual([1, 2, 3, -1]);
  });
});
