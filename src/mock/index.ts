import { mock, Random } from 'mockjs';
import {
  ALL_TIME_SLOTS,
  TOTAL_TIME,
  getTimeSlotsInterval,
  TODAY_DATE,
  isConfictiTimeSlots
} from '../utils';
import { SagaGenerator } from 'core-fe';

const ROOMLIST_KEY = 'mettingroom-reservation-data';
const USERLIST_KEY = 'mettingroom-reservation-userlist-data';

let userList: IUser[] = [];
const _generateUserList = () => {
  try {
    userList = JSON.parse(localStorage.getItem(USERLIST_KEY) as string);
  } catch (err) {}
  if (userList?.length > 0) return;
  userList = mock({
    'list|5': [
      {
        userid: '@ID',
        username: '@NAME'
      }
    ]
  }).list;
  localStorage.setItem(USERLIST_KEY, JSON.stringify(userList));
};
_generateUserList();

export const userInfo: IUser = userList[0];
/**
 * 登录
 */
export const login = async () => {
  return userInfo;
};

/**
 * 获取用户列表
 */
export const getUserList = async () => {
  return userList;
};

/**
 * 获取当个用户的username
 * @param userid 用户id
 */
export const getUserName = async (userid: string) => {
  return userList.find((item: IUser) => item.userid === userid)?.username;
};

/**
 * 获取多个用户的username
 * @param userids 用户id数组 如['1111', '22222']
 * @returns
 */
export const getUserNames = async (userids: string[]) => {
  if (!userids?.length) return [];
  const res = userids.map(
    (userid) => userList.find((item: IUser) => item.userid === userid)?.username
  );
  return res;
};

//room
const roomListMock = mock({
  'list|5': [
    {
      id: '@ID',
      name: '@CTITLE'
    }
  ]
}).list;

const scheduleListMock = mock({
  id: '@ID',
  date: Random.now('yyyy-MM-dd'),
  // room: Random.pick(roomListMock).id,
  timeSlots: Random.pick(ALL_TIME_SLOTS),
  idle: Random.pick([0, 1]),
  user: Random.pick(userList),
  // username: Random.pick(userList).username,
  usageCode: Random.pick([0, 1, 2, 3]),
  usageDesc: '@PARAGRAPH'
  // attendees: mock({
  //   'list|1-10': [Random.pick(userList).userid]
  // }).list
});

// room
let roomList: IRoom[] = [];
let scheduleList: ISchedule[] = [];

const _generateInitialData = () => {
  try {
    roomList = JSON.parse(localStorage.getItem(ROOMLIST_KEY) as string);
  } catch (err) {}
  if (roomList?.length > 0) {
    return;
  }
  roomList = roomListMock.map((item: IRoom) => {
    let schedules: ISchedule[] = [scheduleListMock];
    // @ts-ignore
    schedules = schedules.map((schedule) => {
      const res = {
        ...schedule,
        // @ts-ignore
        ...schedule.user,
        roomId: item.id,
        // @ts-ignore
        attendees: [schedule.user.userid]
      };
      delete res.user;
      return res;
    });

    return { ...item, schedules };
  });

  localStorage.setItem(ROOMLIST_KEY, JSON.stringify(roomList));
};

const _getAllScheduleList = (roomList: IRoom[]) => {
  roomList.forEach((item: IRoom) => {
    scheduleList = scheduleList.concat(item.schedules || []);
  });
};
_generateInitialData();
_getAllScheduleList(roomList);

/**
 * 获取某个日期会议室列表
 * @param date 如2024.4.25
 */
export const getRoomList = async (date: string = TODAY_DATE) => {
  return roomList.map((item) => {
    const scheduleTimes = item.schedules
      ?.filter((schedule) => schedule.date === date)
      ?.map((schedule) => getTimeSlotsInterval(schedule.timeSlots));
    const usedTime = scheduleTimes?.reduce((time, total) => time + total, 0) || 0;
    return {
      id: item.id,
      name: item.name,
      remainTime: TOTAL_TIME - usedTime
    };
  });
};

/**
 * 获取会议室详情
 * @param id 会议室id
 */
export const getRoomDetails = async (id: string) => {
  return roomList.find((item) => item.id === id);
};

// schedule
/**
 * 获取会议室下的日程列表
 * @param roomId 会议室id
 */
export const getScheduleList = async (roomId: string) => {
  return roomList.find((item) => item.id === roomId)?.schedules || [];
};

/**
 * 获取日程详情
 * @param id 日程id
 */
export const getScheduleDetails = async (id: string) => {
  return scheduleList.find((item) => item.id === id);
};

/**
 * 创建日程
 * @param values ISchedule数据，除了id没有
 */
export const createSchedule = async (values: ISchedule) => {
  const { roomId, timeSlots } = values;
  const roomIndex = roomList.findIndex((item) => item.id === roomId);
  const scheduleTime = getTimeSlotsInterval(timeSlots);

  const newSchedule = {
    ...values,
    id: Random.id(),
    ...userInfo
  };

  const oldRoomData = roomList[roomIndex];
  const newRoomData: IRoom = {
    ...oldRoomData,
    remainTime: oldRoomData.remainTime - scheduleTime,
    schedules: [...(oldRoomData.schedules || []), newSchedule]
  };

  const newRoomList = [...roomList];
  newRoomList.splice(roomIndex, 1, newRoomData);
  roomList = newRoomList;
  scheduleList.push(newSchedule);

  localStorage.setItem(ROOMLIST_KEY, JSON.stringify(roomList));

  return newSchedule;
};

/**
 * 编辑日程
 * @param values ISchedule数据
 */
export const editSchedule = async (values: ISchedule) => {
  const { id, roomId, timeSlots } = values;
  const roomIndex = roomList.findIndex((item) => item.id === roomId);
  const scheduleTime = getTimeSlotsInterval(timeSlots);

  const newSchedule = {
    ...values,
    id: '@ID',
    ...userInfo
  };

  const oldRoomData = roomList[roomIndex];
  const roomScheduleIndex = oldRoomData.schedules?.findIndex((item) => item.id === id) as number;
  const oldScheduleTime = getTimeSlotsInterval(
    (oldRoomData.schedules as ISchedule[])[roomScheduleIndex as number].timeSlots
  );

  const newRoomSchedules = [...(oldRoomData.schedules || [])];
  newRoomSchedules.splice(roomScheduleIndex, 1, newSchedule);

  const newRoomData: IRoom = {
    ...oldRoomData,
    remainTime: oldRoomData.remainTime + oldScheduleTime - scheduleTime,
    schedules: newRoomSchedules
  };

  roomList.splice(roomIndex, 1, newRoomData);
  // scheduleList
  const index = scheduleList.findIndex((item) => item.id === id);
  scheduleList.splice(index, 1, newSchedule);

  localStorage.setItem(ROOMLIST_KEY, JSON.stringify(roomList));

  return newSchedule;
};

/**
 * 删除日程
 * @param id 日程id
 */
export const delSchedule = async (id: string) => {
  const index = scheduleList.findIndex((item) => item.id === id);
  const { roomId } = scheduleList[index];

  const roomIndex = roomList.findIndex((item) => item.id === roomId);
  const oldRoomData = roomList[roomIndex];
  const roomScheduleIndex = oldRoomData.schedules?.findIndex((item) => item.id === id);
  const oldScheduleTime = getTimeSlotsInterval(
    // @ts-ignore
    (oldRoomData.schedules[roomScheduleIndex] as ISchedule).timeSlots
  );
  const newRoomSchedules = [...(oldRoomData.schedules || [])];
  newRoomSchedules.splice(roomScheduleIndex as number, 1);

  const newRoomData: IRoom = {
    ...oldRoomData,
    remainTime: oldRoomData.remainTime + oldScheduleTime,
    schedules: newRoomSchedules
  };

  roomList.splice(roomIndex, 1, newRoomData);
  // scheduleList
  scheduleList.splice(index, 1);

  localStorage.setItem(ROOMLIST_KEY, JSON.stringify(roomList));

  return roomList;
};

/**
 * 获取某个日期 时间段已预定的日程
 * @param date 当前日期
 * @param timeSlots 时间段
 * @param id 日程id, 修改则不判断原日程时间段
 * @returns boolean
 */
export const reservedSchedule = async (date: string, timeSlots: string, id?: string) => {
  return scheduleList.find(
    ({ id: scheduleId, timeSlots: scheduleTimeSlots, date: scheduleDate, userid }) => {
      return (
        userid === userInfo.userid &&
        scheduleId !== id &&
        scheduleDate === date &&
        isConfictiTimeSlots(scheduleTimeSlots, timeSlots)
      );
    }
  );
};

// mock('/api/getRoomList', roomList);
