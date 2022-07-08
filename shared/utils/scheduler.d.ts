declare type TCreateScheduler = {
  date: Date;
  callback: () => Promise<any>;
};
export declare const createScheduler: (props: TCreateScheduler) => void;
declare type TDeleteScheduler = {
  targetId: string;
};
export declare const deleteScheduler: (props: TDeleteScheduler) => Promise<boolean>;
export {};
