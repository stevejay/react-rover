import { isNil } from '@/utils';

describe('isNil', () => {
  test.each([
    [null, true],
    [undefined, true],
    [false, false],
    ['', false],
    ['false', false],
    [0, false],
    [[], false],
    [{}, false]
  ])('isNil(%i)', (value, expected) => {
    expect(isNil(value)).toBe(expected);
  });
});
