import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch, useLocation, push, useAction, useLoadingStatus } from 'core-fe';
import type { State } from 'core-fe';
import { Button, Form, DatePicker, Input, Select, Space, message } from 'antd';
import scheduleModuleProxy from '../../modules/schedule';
import { userModuleProxy } from '../../modules/global';
import roomModuleProxy from '../../modules/room';
import {
  USAGE_CODES,
  USAGE_CODE_ENUM,
  ALL_TIME_SLOTS,
  getTimeSlots,
  getTimeSlotsArr,
  DATE_FORMAT
} from '../../utils';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import qs from 'qs';

const { TextArea } = Input;
type Props = {};

function ScheduleEdit({}: Props) {
  const {
    user: {
      userInfo: { userid: myUserid, username: myUsername },
      userList
    },
    scheduleDetails,
    roomDetails
  } = useSelector((state: State) => ({
    user: state.app.user as { userInfo: IUser; userList: IUser[] },
    scheduleDetails: (state.app.schedule.data || {}) as ISchedule,
    roomDetails: (state.app.room.data || {}) as IRoom
  }));
  const dispatch = useDispatch();
  const { getRoomDetails } = roomModuleProxy.getActions();
  const { createSchedule, editSchedule, reservedSchedule } = scheduleModuleProxy.getActions();
  const { getUserList } = userModuleProxy.getActions();
  const loadingStatus = useLoadingStatus('scheduleDetails');
  const { roomId, id } = qs.parse(useLocation().search.slice(1)) as { roomId: string; id: string };

  const [form] = Form.useForm();

  // 可以选的时间段列表
  const timeSlotsOptions = useMemo(() => {
    if (!roomDetails?.schedules?.length) return ALL_TIME_SLOTS;
    return ALL_TIME_SLOTS.filter(
      (item) =>
        !roomDetails.schedules?.find(
          (schedule) => schedule.id !== id && getTimeSlotsArr(schedule.timeSlots).includes(item)
        )
    );
  }, [roomDetails]);

  const handleGetRoomDetails = useAction(getRoomDetails, roomId);
  const handleGetUserList = useAction(getUserList);

  useEffect(() => {
    handleGetRoomDetails();
    handleGetUserList();
  }, [roomId]);

  useEffect(() => {
    if (scheduleDetails) {
      const initialValues: ISchedule & { timeSlotsArr?: string[]; dateDayjs?: Dayjs } = {
        ...scheduleDetails
      };
      initialValues.timeSlotsArr = getTimeSlotsArr(initialValues.timeSlots);
      initialValues.dateDayjs = dayjs(initialValues.date);

      form.setFieldsValue(initialValues);
    } else {
      form.setFieldsValue({
        dateDayjs: dayjs(),
        attendees: [myUserid]
      });
    }
  }, [scheduleDetails]);

  // @ts-ignore
  const goScheduleDetails = useAction(push, `/scheduleDetails/${id}`);
  // @ts-ignore
  const goRoomDetails = useAction(push, `/roomDetails/${roomId}`);

  const handleChangeTimeSlots = (value: string[]) => {
    let newValue = [...value];
    if (value?.length > 1) {
      newValue.sort((time1, time2) => {
        return +time1.split(':')[0] - +time2.split(':')[0];
      });
      const temp = [newValue[0]];
      for (let i = 1; i < newValue.length; i++) {
        if (newValue[i].split('-')[0] !== newValue[i - 1].split('-')[1]) {
          break;
        }
        temp.push(newValue[i]);
      }
      newValue = temp;
    }

    const timeSlots = getTimeSlots(newValue);
    form.setFieldsValue({
      timeSlots,
      timeSlotsArr: getTimeSlotsArr(timeSlots)
    });
  };

  const handleSubmit = async () => {
    if (!roomId) {
      message.error('缺少会议室id');
      return;
    }
    return form
      .validateFields()
      .then(
        (
          values: ISchedule & {
            timeSlotsArr?: string[];
            dateDayjs?: Dayjs;
          }
        ) => {
          const submitData = { ...values, roomId, id };
          submitData.timeSlots = getTimeSlots(submitData.timeSlotsArr);
          submitData.timeSlotsArr = undefined;
          submitData.date = dayjs(submitData.dateDayjs).format(DATE_FORMAT);
          submitData.dateDayjs = undefined;
          console.log(submitData);
          //同一个使用者在同一时间不能同时预订 2 个会议室
          dispatch(
            reservedSchedule(
              submitData.date,
              submitData.timeSlots,
              submitData.id,
              (existSchedule) => {
                if (existSchedule) {
                  message.error(
                    `您已预约会议室id ${existSchedule.roomId} ${existSchedule.timeSlots} 的${USAGE_CODE_ENUM[existSchedule.usageCode]}`
                  );
                  throw `时段不可预约`;
                }
                if (!id) {
                  dispatch(
                    createSchedule(submitData, () => {
                      form.resetFields();
                      goRoomDetails();
                    })
                  );
                } else {
                  dispatch(
                    editSchedule(submitData, () => {
                      form.resetFields();
                      goRoomDetails();
                    })
                  );
                }
              }
            )
          );
        }
      )
      .catch((err) => {
        console.log(err);
      });

    //
  };

  return loadingStatus ? (
    <div>加载中，请稍后。。。</div>
  ) : id && scheduleDetails?.userid !== myUserid ? (
    <div>
      对不起，您没有编辑权限
      <button onClick={goScheduleDetails}>返回查看日程详情</button>
    </div>
  ) : (
    <div>
      <h1>{!id ? '日程创建页' : '日程编辑页'}</h1>
      <Form autoComplete="off" form={form}>
        <Form.Item label="日期" name="dateDayjs">
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="时间段"
          name="timeSlotsArr"
          required
          rules={[
            {
              required: true,
              message: '请选择时间段'
            }
          ]}>
          <Select
            mode="multiple"
            options={timeSlotsOptions.map((item) => ({ value: item }))}
            onChange={handleChangeTimeSlots}
          />
        </Form.Item>
        <Form.Item label="使用者姓名">
          <span className="ant-form-text">{myUsername}</span>
        </Form.Item>
        <Form.Item
          label="使用用途"
          name="usageCode"
          required
          rules={[
            {
              required: true,
              message: '请选择使用用途'
            }
          ]}>
          <Select
            options={USAGE_CODES.map((item) => ({ value: item, label: USAGE_CODE_ENUM[item] }))}
          />
        </Form.Item>
        <Form.Item label="用途描述" name="usageDesc">
          <TextArea />
        </Form.Item>
        <Form.Item
          label="参会人"
          name="attendees"
          required
          rules={[
            {
              required: true,
              message: '请选择参会人'
            }
          ]}>
          <Select
            mode="multiple"
            options={userList?.map((item) => ({
              value: item.userid,
              label: item.username
            }))}
          />
        </Form.Item>
      </Form>
      <Space>
        <Button onClick={id ? goScheduleDetails : goRoomDetails}>返回</Button>
        <Button onClick={handleSubmit}>确定</Button>
      </Space>
    </div>
  );
}

export default scheduleModuleProxy.attachLifecycle(ScheduleEdit);
