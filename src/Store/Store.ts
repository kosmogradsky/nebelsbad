import { List } from "../List/List";

export type Listener = () => void;

export interface Action<S> {
  run(prevState: S): S;
}

export class Store<S> {
  private currentState: S;
  private listeners: List<Listener> = List.empty();

  constructor(initialState: S) {
    this.currentState = initialState;
  }

  subscribe(listener: Listener): void {
    this.listeners = this.listeners.prepend(listener);
  }

  unsubscribe(listenerToRemove: Listener) {
    this.listeners = this.listeners.filter(
      listener => listener === listenerToRemove
    );
  }

  getState(): S {
    return this.currentState;
  }

  dispatch(action: Action<S>): void {
    this.currentState = action.run(this.currentState);

    for (const listener of this.listeners) {
      listener();
    }
  }
}
