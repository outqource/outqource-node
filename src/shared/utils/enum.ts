export const getEnumValues = <T extends object>(target: T) => {
  const value = Object.values(target).reduce(
    (prev, curr) => {
      prev[0] += curr + ',';
      return prev;
    },
    [''],
  );
  return [value[0].slice(0, value[0].length - 1)];
};
