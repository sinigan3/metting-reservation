import React, { useEffect, useState } from 'react';
import { push, useSelector, useDispatch, useParams, useAction, useLoadingStatus } from 'core-fe';
import type { State } from 'core-fe';
import { Button, Form, Space } from 'antd';
import scheduleModuleProxy from '../../modules/schedule';
import { userModuleProxy } from '../../modules/global';
import { USAGE_CODE_ENUM } from '../../utils';

type Props = {};

function ScheduleDetails({}: Props) {
  const {
    scheduleDetails: {
      date,
      timeSlots,
      idle,
      roomId,
      userid,
      username,
      usageCode,
      usageDesc,
      attendees
    },
    userInfo: { userid: myUserid }
  } = useSelector((state: State) => ({
    scheduleDetails: (state.app.schedule.data || {}) as ISchedule,
    userInfo: state.app.user.userInfo as IUser
  }));
  const dispatch = useDispatch();
  const { delSchedule } = scheduleModuleProxy.getActions();
  // @ts-ignore
  const { getUserNames } = userModuleProxy.getActions();
  const loadingStatus = useLoadingStatus('scheduleDetails');
  const id = (useParams() as { id: string }).id;

  const [attendeesNames, setAttendeesNames] = useState<string[]>([]);

  // useEffect(() => {
  //   if (!id) {
  //     return;
  //   }
  //   // @ts-ignore
  //   dispatch(getScheduleDetails(id)).then(({ attendees }: ISchedule = {}) => {
  //     if (attendees?.length) {
  //       getUserNames(attendees).then((names) => {
  //         setAttendeesNames(names as string[]);
  //       });
  //     }
  //   });
  // }, [id]);
  useEffect(() => {
    dispatch(getUserNames(attendees, setAttendeesNames));
  }, [attendees]);

  // @ts-ignore
  const goEdit = useAction(push, `/scheduleEdit?roomId=${roomId}&id=${id}`);

  const handleDelSchedule = useAction<any[]>(delSchedule, id, () => {
    dispatch(push(`/roomDetails/${roomId}`));
  });

  return loadingStatus ? (
    <div>加载中，请稍后。。。</div>
  ) : (
    <div>
      <h1>日程详情页</h1>
      <Form>
        <Form.Item label="日期">
          <span className="ant-form-text">{date}</span>
        </Form.Item>
        <Form.Item label="时间段">
          <span className="ant-form-text">{timeSlots}</span>
        </Form.Item>
        <Form.Item label="是否空闲">
          <span className="ant-form-text">{idle === 1 ? '否' : '是'}</span>
        </Form.Item>
        <Form.Item label="使用者姓名">
          <span className="ant-form-text">{username}</span>
        </Form.Item>
        <Form.Item label="使用用途">
          <span className="ant-form-text">{USAGE_CODE_ENUM[usageCode]}</span>
        </Form.Item>
        <Form.Item label="用途描述">
          <span className="ant-form-text">{usageDesc}</span>
        </Form.Item>
        <Form.Item label="参会人">
          <span className="ant-form-text">{(attendeesNames || attendees)?.join('， ')}</span>
        </Form.Item>
      </Form>
      {myUserid === userid && (
        <Space>
          <Button onClick={goEdit}>编辑</Button>
          <Button onClick={handleDelSchedule}>删除</Button>
        </Space>
      )}
    </div>
  );
}

export default scheduleModuleProxy.attachLifecycle(ScheduleDetails);
