import React from 'react';
import { Switch, Route, Redirect } from 'core-fe';
// import Home from './modules/home';
// import Test from './pages/Test';
import { ConfigProvider, App as AntdApp } from 'antd';
import Header from './pages/Header';
import RoomList from './pages/RoomList';
import RoomDetails from './pages/RoomDetails';
import ScheduleDetails from './pages/ScheduleDetails';
import ScheduleEdit from './pages/ScheduleEdit';
// import './App.css';

function App() {
  return (
    <ConfigProvider>
      <AntdApp>
        <Header />
        <Switch>
          {/* <Route path="/" component={Home} /> */}
          {/* <Route path="/test" component={Test} /> */}
          {/* <Redirect path="/" to="/roomList"></Redirect> */}
          <Route path="/" component={RoomList} />
          <Route path="/roomDetails/:id" component={RoomDetails} />
          <Route path="/scheduleDetails/:id" component={ScheduleDetails} />
          <Route path="/scheduleEdit" component={ScheduleEdit} />
        </Switch>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
