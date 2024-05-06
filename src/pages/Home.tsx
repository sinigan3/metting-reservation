import { NavLink, useSelector } from 'core-fe';
import { increase, decrease } from '../modules/home';
type Props = any;

export default function Home({}: Props) {
  // @ts-ignore
  const state = useSelector((state) => state.app.home);
  // const dispatch = useDispatch();

  return (
    <div>
      Home
      <NavLink to="/test">test page</NavLink>
      <div>
        {
          // @ts-ignore
          state.homeCount
        }
      </div>
      <button onClick={increase}>increase</button>
      <button onClick={decrease}>decrease</button>
    </div>
  );
}
