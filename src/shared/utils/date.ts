const weekNumberByThurFnc = (paramDate: Date) => {
  const year = paramDate.getFullYear();
  const month = paramDate.getMonth();
  const date = paramDate.getDate();

  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
  const lastDayOfweek = lastDate.getDay();

  const lastDay = lastDate.getDate();

  const firstWeekCheck = firstDayOfWeek === 5 || firstDayOfWeek === 6 || firstDayOfWeek === 7;
  const lastWeekCheck = lastDayOfweek === 1 || lastDayOfweek === 2 || lastDayOfweek === 3;
  const lastWeekNo = Math.ceil((firstDayOfWeek - 1 + lastDay) / 7);

  let weekNo: string | number = Math.ceil((firstDayOfWeek - 1 + date) / 7);

  if (weekNo === 1 && firstWeekCheck) weekNo = 'prev';
  else if (weekNo === lastWeekNo && lastWeekCheck) weekNo = 'next';
  else if (firstWeekCheck) weekNo = weekNo - 1;

  return weekNo;
};
export const weekNumberByMonth = (dateFormat: string) => {
  const inputDate = new Date(dateFormat);

  let year = inputDate.getFullYear();
  let month = inputDate.getMonth() + 1;

  let weekNo = weekNumberByThurFnc(inputDate);

  if (weekNo === 'prev') {
    const afterDate = new Date(year, month - 1, 0);
    year = month === 1 ? year - 1 : year;
    month = month === 1 ? 12 : month - 1;
    weekNo = weekNumberByThurFnc(afterDate);
  }

  if (weekNo === 'next') {
    year = month === 12 ? year + 1 : year;
    month = month === 12 ? 1 : month + 1;
    weekNo = 1;
  }

  return { year, month, weekNo };
};

export const getTodayStartEnd = () => {
  const todayStart = new Date();
  todayStart.setHours(0);
  todayStart.setMinutes(0);
  todayStart.setSeconds(0);

  const todayEnd = new Date();
  todayEnd.setHours(23);
  todayEnd.setMinutes(59);
  todayEnd.setSeconds(59);

  return {
    todayStart,
    todayEnd,
  };
};

export const getRecentYearStartEnd = (target: number) => {
  const startAt = new Date();
  startAt.setFullYear(startAt.getFullYear() - target, startAt.getMonth(), startAt.getDate());

  const endAt = new Date();

  return {
    startAt,
    endAt,
  };
};

export const getDatesStartToLast = (startDate: string, lastDate: string): string[] | null => {
  const regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

  if (!(regex.test(startDate) && regex.test(lastDate))) return null;
  const result = [];
  const curDate = new Date(startDate);
  while (curDate <= new Date(lastDate)) {
    result.push(curDate.toISOString().split('T')[0]);
    curDate.setDate(curDate.getDate() + 1);
  }
  return result;
};
