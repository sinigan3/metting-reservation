import React, { useEffect, useMemo } from 'react';
import type { MouseEventHandler } from 'react';
import {
  push,
  useSelector,
  useDispatch,
  useParams,
  useLocation,
  useAction,
  useLoadingStatus
} from 'core-fe';
import type { State } from 'core-fe';
import { Button, Space } from 'antd';
import roomModuleProxy from '../../modules/room';
import scheduleModuleProxy from '../../modules/schedule';
import { USAGE_CODE_ENUM, TODAY_DATE, ALL_TIME_SLOTS, getTimeSlotsArr } from '../../utils';
import qs from 'qs';

type Props = {};

function RoomDetails({}: Props) {
  const {
    roomDetails: { name, schedules },
    userInfo: { userid: myUserid }
  } = useSelector((state: State) => ({
    roomDetails: (state.app.room.data || {}) as IRoom,
    userInfo: state.app.user.userInfo as IUser
  }));
  const dispatch = useDispatch();
  const id = (useParams() as { id: string }).id;
  const { date } = qs.parse(useLocation().search.slice(1)) as { date: string };
  const { getRoomDetails } = roomModuleProxy.getActions();
  const { delSchedule } = scheduleModuleProxy.getActions();
  const loadingStatus = useLoadingStatus('roomDetails');

  // useEffect(() => {
  //   if (!id) {
  //     return;
  //   }
  //   dispatch(getRoomDetails(id));
  // }, [id]);

  const handleGetRoomDetails = useAction(getRoomDetails, id);

  const goScheduleDetails: MouseEventHandler = (e) => {
    const scheduleId = (e.target as HTMLElement).dataset.id;
    if (scheduleId) {
      dispatch(push(`/scheduleDetails/${scheduleId}`));
    }
  };

  const goEdit = (scheduleId?: string) => {
    dispatch(push(`/scheduleEdit?roomId=${id}${scheduleId ? `&id=${scheduleId}` : ''}`));
  };

  const handleDelSchedule = function (scheduleId: string) {
    dispatch(
      delSchedule(scheduleId, () => {
        handleGetRoomDetails();
      })
    );
  };

  const showTimeSlotsList = useMemo(() => {
    if (!schedules?.length) return ALL_TIME_SLOTS;
    let slotTimesArr = ALL_TIME_SLOTS.map((item) => {
      const schedule = schedules?.find((schedule) => {
        return getTimeSlotsArr(schedule.timeSlots).includes(item);
      });
      if (schedule) {
        return schedule.timeSlots;
      }
      return item;
    });
    slotTimesArr = Array.from(new Set(slotTimesArr));
    return slotTimesArr;
  }, [schedules]);

  return loadingStatus ? (
    <div>加载中，请稍后。。。</div>
  ) : (
    <div>
      <h1>
        会议室名称：{name}， 当前日期：{date || TODAY_DATE}
      </h1>
      <Button onClick={() => goEdit()}>创建新日程</Button>
      <ul onClick={goScheduleDetails}>
        <Space direction="vertical">
          {showTimeSlotsList.map((item) => {
            const schedule = schedules?.find((schedule) => schedule.timeSlots === item);
            if (schedule) {
              const { id: scheduleId, timeSlots, userid, username, usageCode } = schedule;
              return (
                <li key={item}>
                  <Space>
                    <span data-id={scheduleId}>
                      时间段：{item}， 使用者：{username}， 用途{USAGE_CODE_ENUM[usageCode]}
                    </span>
                    {myUserid === userid && (
                      <>
                        <Button onClick={() => goEdit(scheduleId)}>编辑</Button>
                        <Button onClick={() => handleDelSchedule(scheduleId)}>删除</Button>
                      </>
                    )}
                  </Space>
                </li>
              );
            } else {
              return (
                <li key={item}>
                  <Space>
                    <span> 时间段：{item}</span>
                  </Space>
                </li>
              );
            }
          })}
          {/* {schedules?.map(({ id: scheduleId, timeSlots, userid, username, usageCode }) => (
          <li key={scheduleId}>
            <Space>
              <span data-id={scheduleId}>
                {timeSlots}
                --{username}
                --{USAGE_CODE_ENUM[usageCode]}
              </span>
              {myUserid === userid && (
                <>
                  <Button onClick={() => goEdit(scheduleId)}>编辑</Button>
                  <Button onClick={() => handleDelSchedule(scheduleId)}>删除</Button>
                </>
              )}
            </Space>
          </li>
        ))} */}
        </Space>
      </ul>
    </div>
  );
}

export default roomModuleProxy.attachLifecycle(RoomDetails);
