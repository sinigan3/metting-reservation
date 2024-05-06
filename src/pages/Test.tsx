import { NavLink } from 'core-fe';

type Props = {};

export default function Test({}: Props) {
  return (
    <div>
      Test
      <NavLink to="/">home page</NavLink>
    </div>
  );
}
