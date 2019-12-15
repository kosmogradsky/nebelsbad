import { Action, Store } from "./Store";

class CounterState {
  constructor(readonly count: number) {}

  setCount(count: number) {
    return new CounterState(count);
  }
}

const counterState: CounterState = new CounterState(0);

class Increment implements Action<CounterState> {
  constructor(readonly by: number) {}

  run(prevState: CounterState): CounterState {
    return prevState.setCount(prevState.count + this.by);
  }
}

describe("Store", () => {
  test("correctly gets state", () => {
    const store = new Store(counterState);

    expect(store.getState()).toBe(counterState);
  });

  test("correctly dispatches and modifies state correpondingly", () => {
    const store = new Store<CounterState>(new CounterState(2));
    store.dispatch(new Increment(5));

    expect(store.getState()).toEqual(new CounterState(7));
  });

  test("correctly subscribes and pushes events on state change", () => {
    const states: CounterState[] = [];
    const store = new Store<CounterState>(new CounterState(2));

    store.subscribe(() => {
      states.push(store.getState());
    });

    store.dispatch(new Increment(5));
    store.dispatch(new Increment(3));

    expect(states).toEqual([new CounterState(7), new CounterState(10)]);
  });
});
