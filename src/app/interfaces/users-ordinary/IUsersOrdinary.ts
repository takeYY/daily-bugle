import { IOrdinary } from '../ordinary/IOrdinary';
import { IWeekday } from '../weekday/IWeekday';

export interface IUsersOrdinary {
  userId: string;
  ordinary: IOrdinary;
  weekdays: IWeekday[];
  startedOn: Date;
  createdAt: Date;
  updatedAt: Date;
  isClosed: boolean;
}
