import { getRandomArrayElement } from './random.util';

describe('getRandomArrayElement', () => {
  it('should return null for empty array', () => {
    expect(getRandomArrayElement([])).toBeNull();
  });

  it('should return null for non-array input', () => {
    expect(getRandomArrayElement(null as any)).toBeNull();
    expect(getRandomArrayElement(undefined as any)).toBeNull();
    expect(getRandomArrayElement('not-an-array' as any)).toBeNull();
  });

  it('should return an element from the array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = getRandomArrayElement(arr);
    expect(arr).toContain(result);
  });

  it('should work with array of strings', () => {
    const arr = ['a', 'b', 'c'];
    const result = getRandomArrayElement(arr);
    expect(arr).toContain(result);
  });

  it('should work with array of objects', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    const result = getRandomArrayElement(arr);
    expect(arr).toContain(result);
  });
});
