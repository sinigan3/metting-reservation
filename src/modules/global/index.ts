import type { State } from 'core-fe';

export { default as userModuleProxy } from './user';

declare global {
  interface RootState extends State {
    app: {
      user: { userInfo: IUser; userList: IUser[] };
      room: { list: IRoom[]; data: IRoom | null };
      schedule: { list: ISchedule[]; data: ISchedule | null };
    };
  }
}
