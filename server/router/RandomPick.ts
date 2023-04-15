export const RandomPick = <T>(arr: Array<T>) => {
  return arr[Math.floor(arr.length * Math.random())];
};
