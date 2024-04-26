import { Module, register } from 'core-fe';
import Home from '../pages/Home';

const homeModule = new Module('home', {
  homeCount: 1
});
// homeModule.onEnter = function *(props) {
//     console.log('-------home module enter:', props);
// }
// homeModule.onDestroy = function *() {
//     console.log('-------home module onDestroy');
// }
// homeModule.onLocationMatched = function *(routeParam, location) {
//     console.log('-------home module onLocationMatched:', routeParam, location);
// }
// homeModule.onTick = function *() {
//     console.log('-------home module onTick');
// }

export function increase() {
  console.log(homeModule.rootState);
  const state = homeModule.state;
  homeModule.setState({ homeCount: state.homeCount + 1 });
}

export function decrease() {
  const state = homeModule.state;
  homeModule.setState({ homeCount: state.homeCount - 1 });
}

const homeModuleProxy = register(homeModule);

export default homeModuleProxy.attachLifecycle(Home);
