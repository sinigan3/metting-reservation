import React, { useState, useEffect } from 'react';
import type { MouseEventHandler } from 'react';
import { push, useSelector, useDispatch, useLoadingStatus } from 'core-fe';
import type { State } from 'core-fe';
import { Input, DatePicker, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import roomModuleProxy from '../../modules/room';
import { TODAY_DATE } from '../../utils';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

type Props = {};

function RoomList({}: Props) {
  const roomList: IRoom[] = useSelector((state: State) => state.app.room.list || []);
  const dispatch = useDispatch();
  const { getRoomList } = roomModuleProxy.getActions();
  const loadingStatus = useLoadingStatus('roomList');

  const [localRoomList, setLocalRoomList] = useState<IRoom[]>(roomList);
  const [date, setDate] = useState(TODAY_DATE);
  const [searchText, setSearchText] = useState('');

  // useEffect(() => {
  //   dispatch(getRoomList());
  // }, []);

  useEffect(() => {
    const searchTextTrim = searchText.trim();
    if (!searchTextTrim) setLocalRoomList(roomList);
    setLocalRoomList(
      roomList.filter((item) => item.id.includes(searchText) || item.name.includes(searchText))
    );
  }, [roomList, searchText]);

  const goRoomDetails: MouseEventHandler = (e) => {
    const id = (e.target as HTMLElement).dataset.id;
    if (id) {
      dispatch(push(`/roomDetails/${id}?date=${date}`));
    }
  };

  const handleChangeDate = (_: Dayjs, dateStr: string | string[]) => {
    dateStr = dateStr as string;
    setDate(dateStr);
    dispatch(getRoomList(dateStr));
  };
  console.log('------------loadingStatus', loadingStatus);
  return loadingStatus ? (
    <div>加载中，请稍后。。。</div>
  ) : (
    <div>
      <h1>会议列表页</h1>
      <Space>
        <Input
          addonBefore={<SearchOutlined />}
          placeholder="请输入名称查询"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DatePicker value={dayjs(date)} onChange={handleChangeDate} />
      </Space>
      <ul onClick={goRoomDetails}>
        {localRoomList.map(({ id, name, remainTime }) => (
          <li key={id} data-id={id}>
            会议室编号：{id}， 会议室名称：{name}， 当天剩余时长{remainTime}h
          </li>
        ))}
      </ul>
    </div>
  );
}

export default roomModuleProxy.attachLifecycle(RoomList);
