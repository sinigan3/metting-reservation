import { Module, register, Loading } from 'core-fe';
import type { SagaGenerator } from 'core-fe';
import { call, delay } from 'redux-saga/effects';
import { getRoomList as _getRoomList, getRoomDetails as _getRoomDetails } from '../mock';
// import { decorator } from '../utils';

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
    super('room', { list: [], data: {} });
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
    this.setState({ data: {} });
  }
  /**
   * 获取某个日期会议室列表
   * @param date 如2024.4.25
   */
  *getRoomList(date?: string): SagaGenerator {
    yield delay(2000);
    const data = (yield call(_getRoomList, date)) as IRoom[];
    this.setState({ list: data });
  }
  /**
   * 获取会议室详情
   * @param id 会议室id
   */
  *getRoomDetails(id: string) {
    const data = (yield call(_getRoomDetails, id)) as IRoom;
    this.setState({ data });
  }
}

const roomModule = new RoomModulle();

roomModule.getRoomList = Loading('roomList')(roomModule.getRoomList, {
  kind: 'method',
  name: 'getRoomList',
  static: false,
  private: false,
  access: {
    has() {
      return false;
    },
    get(object: RoomModulle) {
      return object.getRoomList;
    }
  },
  addInitializer() {},
  metadata: {
    Symbol: Symbol()
  }
});

export default register(roomModule);
