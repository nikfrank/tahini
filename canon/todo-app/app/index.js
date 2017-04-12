import React, { Component } from 'react';
import { render } from 'react-dom';

import Dashboard from './components/Dashboard/';

import './index.css';

import { bootApp, networkMiddleware } from 'tahini';



class Home extends Component {
  componentWillMount(){
    this.DashboardDevice =
      this.props.getDevice(
        Dashboard,
        ['dashboard'],
        Dashboard.initState,
      );
  }

  render(){
    const {
      DashboardDevice,
    } = this;
    
    return (
      <div>
        <DashboardDevice/>
      </div>
    );
  }
}

// also import the middleware and apply to the store
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
}

import networkHandlers from './network/';

const RootDevice =
  bootApp( [ networkMiddleware(networkHandlers) ] )
    .getDevice(Home);

render(
  <RootDevice/>,
  document.getElementById('root')
);
