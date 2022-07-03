export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const createRandomNumbers = (length: number): string => {
  const chars = '0123456789';

  let randomstring = '';
  for (let i = 0; i < length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};
