import { Module, register } from 'core-fe';
// import ScheduleDetails from '../pages/ScheduleDetails';
import {
  getScheduleList as _getScheduleList,
  getScheduleDetails as _getScheduleDetails,
  createSchedule as _createSchedule,
  editSchedule as _editSchedule,
  delSchedule as _delSchedule,
  reservedSchedule as _reservedSchedule
} from '../mock';

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

const scheduleModule = new Module('schedule', { list: [], data: {} });

/**
 * 获取会议室下的日程列表
 * @param roomId 会议室id
 */
export const getScheduleList = async (roomId: string) => {
  const data = await _getScheduleList(roomId);
  scheduleModule.setState({
    list: data
  });
};

/**
 * 获取日程详情
 * @param id 日程id
 */
export const getScheduleDetails = async (id: string) => {
  const data = await _getScheduleDetails(id);
  scheduleModule.setState({
    data
  });
  return data;
};

/**
 * 创建日程
 * @param values ISchedule数据，除了id没有
 */
export const createSchedule = async (values: Pick<ISchedule, 'id'>) => {
  await _createSchedule(values as ISchedule);
};

/**
 * 编辑日程
 * @param values ISchedule数据
 */
export const editSchedule = async (values: ISchedule) => {
  await _editSchedule(values);
};

/**
 * 删除日程
 * @param id 日程id
 */
export const delSchedule = async (id: string) => {
  await _delSchedule(id);
};

/**
 * 获取某个日期 时间段已预定的日程
 * @param date 当前日期
 * @param timeSlots 时间段
 * @param id 日程id, 修改则不判断原日程时间段
 * @returns boolean
 */
export const reservedSchedule = async (date: string, timeSlots: string, id?: string) => {
  const data = await _reservedSchedule(date, timeSlots, id);
  return data;
};
register(scheduleModule);
// export default register(scheduleModule).attachLifecycle(ScheduleDetails);
