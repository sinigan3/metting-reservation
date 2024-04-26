import React from 'react';
import { useSelector } from 'core-fe';
import type { State } from 'core-fe';

type Props = {};

export default function Header({}: Props) {
  const { username } = useSelector((state: State) => state.app.user.userInfo as IUser);
  return <div>当前登录用户：{username}</div>;
}
