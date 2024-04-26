import { Module, register } from 'core-fe';
import {
  userInfo,
  getUserList as _getUserList,
  getUserName as _getUserName,
  getUserNames as _getUserNames
} from '../mock';

declare global {
  interface IUser {
    userid: string;
    username: string;
  }
}

const userMudule = new Module('user', {
  userInfo: userInfo,
  userList: []
});

/**
 * 获取用户列表
 */
export const getUserList = async () => {
  const data = await _getUserList();
  userMudule.setState({
    userList: data
  });
};

/**
 * 获取当个用户的username
 * @param userid 用户id
 */
export const getUserName = async (userid: string) => {
  return _getUserName(userid);
};

/**
 * 获取多个用户的username
 * @param userids 用户id数组 如['1111', '22222']
 * @returns 用户名称数组, 如['username1', 'username2']
 */
export const getUserNames = async (userids: string[]) => {
  if (!userids?.length) return [];
  const data = await _getUserNames(userids);
  return data;
};

register(userMudule);
