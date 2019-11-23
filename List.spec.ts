import { List } from "./List";

function* numbers(finishedCheck: () => void) {
  let i = 0;
  try {
    while (true) {
      yield ++i;
    }
  } finally {
    finishedCheck();
  }
}

function* numbersUpTo4(finishedCheck: () => void) {
  let i = 0;
  try {
    while (true) {
      const next = ++i;

      yield next;

      if (next === 4) {
        return;
      }
    }
  } finally {
    finishedCheck();
  }
}

describe("List", () => {
  test("toArray method should work", () => {
    const finishedCheck = jest.fn();

    expect(new List(numbersUpTo4(finishedCheck)).toArray()).toEqual([
      1,
      2,
      3,
      4
    ]);
    expect(finishedCheck).toHaveBeenCalled();
  });

  test("take method should work", () => {
    const finishedCheck = jest.fn();

    expect(new List(numbers(finishedCheck)).take(4).toArray()).toEqual([
      1,
      2,
      3,
      4
    ]);
    expect(finishedCheck).toHaveBeenCalled();
  });

  test("should work with arrays", () => {
    expect(new List([1, 2, 3, 4]).toArray()).toEqual([1, 2, 3, 4]);
  });

  test("should create singletons", () => {
    expect(List.of(1).toArray()).toEqual([1]);
  });

  test("should create empty lists", () => {
    expect(List.empty().toArray()).toEqual([]);
  });

  test("should concat", () => {
    const finishedCheck = jest.fn();

    expect(
      List.concat(
        numbersUpTo4(finishedCheck),
        [5, 6],
        List.of(7),
        List.empty()
      ).toArray()
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("should map", () => {
    const finishedCheck = jest.fn();

    expect(
      new List(numbersUpTo4(finishedCheck)).map(num => num + 3).toArray()
    ).toEqual([4, 5, 6, 7]);
    expect(finishedCheck).toHaveBeenCalled();
  });

  test("should filter", () => {
    const finishedCheck = jest.fn();

    expect(
      new List(numbersUpTo4(finishedCheck))
        .filter(num => num % 2 === 0)
        .toArray()
    ).toEqual([2, 4]);
    expect(finishedCheck).toHaveBeenCalled();
  });

  test("should skip", () => {
    const finishedCheck = jest.fn();

    expect(new List(numbersUpTo4(finishedCheck)).skip(2).toArray()).toEqual([
      3,
      4
    ]);
    expect(finishedCheck).toHaveBeenCalled();
  });

  test("should return head", () => {
    const finishedCheck = jest.fn();

    expect(new List(numbersUpTo4(finishedCheck)).head()).toEqual(1);
    expect(finishedCheck).toHaveBeenCalled();
  });
});
