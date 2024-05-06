import { Module, register, Loading, Interval } from 'core-fe';
import type { SagaGenerator } from 'core-fe';
import { call, delay } from 'redux-saga/effects';
import { getRoomList as _getRoomList, getRoomDetails as _getRoomDetails } from '../mock';
// import { decorator } from '@utils';

declare global {
  interface IRoom {
    id: string;
    name: string;
    remainTime: number;
    schedules?: ISchedule[];
  }
}

class RoomModulle extends Module<RootState, 'room'> {
  constructor() {
    super('room', { list: [], data: null });
  }

  *onEnter(entryComponentProps: any): SagaGenerator {
    const {
      match: { path, params }
    } = entryComponentProps;
    if (path === '/') {
      yield call(this.getRoomList.bind(this));
    } else if (path.includes('/roomDetails')) {
      const { id } = params;
      if (!id) return;
      yield call(this.getRoomDetails.bind(this), id);
    }
  }
  // *onLocationMatched(routeParam: object, location: ModuleLocation<object>): SagaGenerator {
  // }
  *onDestroy(): SagaGenerator {
    this.setState({ data: null });
  }
  @Interval(5)
  *onTick(): SagaGenerator {
    console.log('-----------update');
    yield call(this.getRoomList.bind(this));
  }
  /**
   * 获取某个日期会议室列表
   * @param date 如2024.4.25
   */
  @Loading('roomList')
  *getRoomList(date?: string): SagaGenerator {
    yield delay(1000);
    const data = (yield call(_getRoomList, date)) as IRoom[];
    this.setState({ list: data });
  }
  /**
   * 获取会议室详情
   * @param id 会议室id
   */
  @Loading('roomDetails')
  *getRoomDetails(id: string): SagaGenerator {
    yield delay(1000);
    const data = (yield call(_getRoomDetails, id)) as IRoom;
    this.setState({ data });
  }
}

const roomModule = new RoomModulle();

export default register(roomModule);
