export function getRandomArrayElement(arr: unknown[]): unknown {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}
