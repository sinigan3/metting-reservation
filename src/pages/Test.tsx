import React from 'react';
import { NavLink } from 'core-fe';

type Props = {};

const a = '1';
export default function Test({}: Props) {
  return (
    <div>
      Test
      <NavLink to="/">home page</NavLink>
    </div>
  );
}
