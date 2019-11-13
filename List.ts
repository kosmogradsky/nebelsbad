function* concat<T>(iterables: Iterable<Iterable<T>>): Generator<T> {
  for (const iterable of iterables) {
    for (const value of iterable) {
      yield value;
    }
  }
}

function* empty<T>(): Generator<T> {
  return;
}

function* of<T>(value: T): Generator<T> {
  yield value;
  return;
}

function* take<T>(count: number, source: Iterable<T>): Generator<T> {
  let taken = 0;

  for (const value of source) {
    if (taken === count) {
      return;
    }

    taken++;
    yield value;
  }
}

function* map<T, R>(
  project: (value: T) => R,
  source: Iterable<T>
): Generator<R> {
  for (const value of source) {
    yield project(value);
  }
}

function* filter<T>(
  project: (value: T) => boolean,
  source: Iterable<T>
): Generator<T> {
  for (const value of source) {
    if (project(value)) {
      yield value;
    }
  }
}

export class List<T> implements Iterable<T> {
  constructor(private readonly iterable: Iterable<T>) {}

  [Symbol.iterator]() {
    return this.iterable[Symbol.iterator]();
  }

  static empty<T>(): List<T> {
    return new List(empty<T>());
  }

  static of<T>(value: T): List<T> {
    return new List(of(value));
  }

  static concat<T>(...iterables: Iterable<T>[]) {
    return new List(concat(iterables));
  }

  static fromArray<T>(array: T[]): List<T> {
    return new List(array[Symbol.iterator]());
  }

  take(count: number): List<T> {
    return new List(take(count, this.iterable));
  }

  map<R>(project: (value: T) => R): List<R> {
    return new List(map(project, this.iterable));
  }

  filter(project: (value: T) => boolean): List<T> {
    return new List(filter(project, this.iterable));
  }

  toArray(): T[] {
    return Array.from(this.iterable);
  }
}
