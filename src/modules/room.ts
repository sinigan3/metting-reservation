import { Module, register, ajax } from 'core-fe';
// import RoomList from '../pages/RoomList';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../utils';

import { getRoomList as _getRoomList, getRoomDetails as _getRoomDetails } from '../mock';

declare global {
  interface IRoom {
    id: string;
    name: string;
    remainTime: number;
    schedules?: ISchedule[];
  }
}

const roomModule = new Module('room', { list: [], data: {} });

/**
 * 获取某个日期会议室列表
 * @param date 如2024.4.25
 */
export const getRoomList = async (date?: string) => {
  // const data = await ajax('GET', '/api/getRoomList', {}, {});
  // console.log(777, data);

  const data = await _getRoomList(date);
  roomModule.setState({ list: data });
};

/**
 * 获取会议室详情
 * @param id 会议室id
 */
export const getRoomDetails = async (id: string) => {
  const data = await _getRoomDetails(id);
  roomModule.setState({ data });
};

register(roomModule);
// export default register(roomModule).attachLifecycle(RoomList);
