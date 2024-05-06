import { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'core-fe';
// import Home from '@modules/home';
// import Test from '@pages/Test';
import { ConfigProvider, App as AntdApp } from 'antd';
import Header from '@pages/Header';
import RoomList from '@pages/RoomList';
const RoomDetails = lazy(() => import('@pages/RoomDetails'));
const ScheduleDetails = lazy(() => import('@pages/ScheduleDetails'));
const ScheduleEdit = lazy(() => import('@pages/ScheduleEdit'));
// import './App.css';

function App() {
  return (
    <ConfigProvider>
      <AntdApp>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={RoomList} />
            <Route path="/roomDetails/:id" component={RoomDetails} />
            <Route path="/scheduleDetails/:id" component={ScheduleDetails} />
            <Route path="/scheduleEdit" component={ScheduleEdit} />
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
