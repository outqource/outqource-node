import schedule from 'node-schedule';

type TCreateScheduler = {
  date: Date;
  callback: () => Promise<any>;
};

export const createScheduler = (props: TCreateScheduler) => {
  try {
    schedule.scheduleJob(props.date, async () => {
      try {
        console.log('스케쥴러 실행');
        await props.callback();
      } catch (e) {
        throw { status: 500, message: e };
      }
    });
  } catch (e) {
    throw { status: 500, message: e };
  }
};

type TDeleteScheduler = {
  targetId: string;
};

export const deleteScheduler = (props: TDeleteScheduler) => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(schedule.cancelJob(props.targetId));
    } catch (e) {
      reject(e);
    }
  });
};
