export declare const weekNumberByMonth: (dateFormat: string) => {
  year: number;
  month: number;
  weekNo: string | number;
};
export declare const getTodayStartEnd: () => {
  todayStart: Date;
  todayEnd: Date;
};
export declare const getRecentYearStartEnd: (target: number) => {
  startAt: Date;
  endAt: Date;
};
export declare const getDatesStartToLast: (startDate: string, lastDate: string) => string[] | null;
