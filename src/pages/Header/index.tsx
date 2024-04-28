import React from 'react';
import { useSelector, useLocation, NavLink } from 'core-fe';
import type { State } from 'core-fe';
import { Breadcrumb } from 'antd';

type Props = {};

export default function Header({}: Props) {
  const { username } = useSelector((state: State) => state.app.user.userInfo as IUser);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <NavLink to="/">{'<--'}返回会议室列表页</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      当前登录用户：{username}
    </div>
  );
}
