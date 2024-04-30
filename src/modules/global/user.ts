import { Module, register } from 'core-fe';
import { call } from 'redux-saga/effects';
import type { SagaGenerator } from 'core-fe';
import {
  userInfo,
  getUserList as _getUserList,
  getUserName as _getUserName,
  getUserNames as _getUserNames
} from '../../mock';

declare global {
  interface IUser {
    userid: string;
    username: string;
  }
}

class UserModulle extends Module<RootState, 'user'> {
  constructor() {
    super('user', {
      userInfo: userInfo,
      userList: []
    });
  }

  /**
   * 获取用户列表
   */
  *getUserList(): SagaGenerator {
    const data = (yield call(_getUserList)) as IUser[];
    this.setState({
      userList: data
    });
  }

  /**
   * 获取当个用户的username
   * @param userid 用户id
   */
  *getUserName(userid: string): SagaGenerator {
    yield call(_getUserName, userid);
  }

  /**
   * 获取多个用户的username
   * @param userids 用户id数组 如['1111', '22222']
   * @returns 用户名称数组, 如['username1', 'username2']
   */
  *getUserNames(userids: string[], cb?: (userNames: string[]) => void): SagaGenerator {
    if (!userids?.length) {
      cb?.([]);
      return;
    }
    const data = (yield call(_getUserNames, userids)) as string[];
    cb?.(data);
  }
}

export default register(new UserModulle());
