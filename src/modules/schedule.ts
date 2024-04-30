import { Module, register, Loading, Log } from 'core-fe';
import { call, delay } from 'redux-saga/effects';
import type { ModuleLocation, SagaGenerator } from 'core-fe';
import {
  getScheduleList as _getScheduleList,
  getScheduleDetails as _getScheduleDetails,
  createSchedule as _createSchedule,
  editSchedule as _editSchedule,
  delSchedule as _delSchedule,
  reservedSchedule as _reservedSchedule
} from '../mock';
import qs from 'qs';

declare global {
  interface ISchedule {
    id: string;
    date: string;
    timeSlots: string;
    idle?: 0 | 1; // 0|1
    roomId: string;
    userid: string;
    username: string;
    usageCode: number; // 编号代表
    usageDesc: string;
    attendees: string[];
  }
}

class ScheduleModule extends Module<RootState, 'schedule'> {
  constructor() {
    super('schedule', { list: [], data: null });
  }

  *onEnter(entryComponentProps: any): SagaGenerator {
    const {
      match: { path, params }
    } = entryComponentProps;
    if (path.includes('/scheduleDetails')) {
      const { id } = params;
      if (!id) return;
      yield call(this.getScheduleDetails.bind(this), id);
    }
  }
  *onLocationMatched(routeParam: object, location: ModuleLocation<object>): SagaGenerator {
    const { pathname, search } = location;
    const { id } = qs.parse(search.slice(1));
    if (pathname === '/scheduleEdit' && id) {
      //@ts-ignore
      yield call(this.getScheduleDetails.bind(this), id);
    }
  }
  *onDestroy(): SagaGenerator {
    this.setState({
      data: null
    });
  }
  /**
   * 获取会议室下的日程列表
   * @param roomId 会议室id
   */

  *getScheduleList(roomId: string) {
    const data = (yield call(_getScheduleList, roomId)) as ISchedule[];
    this.setState({
      list: data
    });
  }

  /**
   * 获取日程详情
   * @param id 日程id
   */
  // @ts-ignore
  @Loading('scheduleDetails')
  *getScheduleDetails(id: string) {
    yield delay(1000);
    const data = (yield call(_getScheduleDetails, id)) as ISchedule;
    this.setState({
      data
    });
    return data;
  }

  /**
   * 创建日程
   * @param values ISchedule数据，除了id没有
   */
  // @ts-ignore
  @Log()
  *createSchedule(values: Pick<ISchedule, 'id'>, cb?: () => void) {
    yield call(_createSchedule, values as ISchedule);
    cb?.();
  }

  /**
   * 编辑日程
   * @param values ISchedule数据
   */
  // @ts-ignore
  @Log()
  *editSchedule(values: ISchedule, cb?: () => void) {
    yield call(_editSchedule, values);
    cb?.();
  }

  /**
   * 删除日程
   * @param id 日程id
   */
  // @ts-ignore
  @Log()
  *delSchedule(id: string, cb?: () => void) {
    yield call(_delSchedule, id);
    cb?.();
  }

  /**
   * 获取某个日期 时间段已预定的日程
   * @param date 当前日期
   * @param timeSlots 时间段
   * @param id 日程id, 修改则不判断原日程时间段
   * @returns ISchedule
   */
  *reservedSchedule(date: string, timeSlots: string, id?: string, cb?: (data: ISchedule) => void) {
    const data = (yield call(_reservedSchedule, date, timeSlots, id)) as ISchedule;
    cb?.(data);
  }
}

export default register(new ScheduleModule());
