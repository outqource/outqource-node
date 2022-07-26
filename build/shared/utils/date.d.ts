interface WeekNumberByMonth {
  year: number;
  month: number;
  weekNo: number | string;
}
interface TodayStartEnd {
  todayStart: Date;
  todayEnd: Date;
}
export declare const getWeekNumberByMonth: (dateFormat: string) => WeekNumberByMonth;
export declare const getTodayStartEnd: () => TodayStartEnd;
export declare const getDatesStartToLast: (startDate: string, lastDate: string) => string[] | null;
export {};
