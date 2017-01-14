import React from 'react';
import {render} from 'react-dom';

import {Router, Route, hashHistory} from 'react-router';

import TodoList from './components/TodoList/';
import SortedTodoList from './components/SortedTodoList/';
import Dashboard from './components/Dashboard/';

import './index.css';

import { Base, bootApp, networkMiddleware } from 'tahini';

class Home extends Base {
  render(){
    return (
      <div>
	{this.props.children}
      </div>
    );
  }
}


const routes = [
  {
    routePath:'todo-list',
    dataPath:['todo-list'],
    componentClass:TodoList
  },
  {
    routePath:'sorted-todo-list',
    dataPath:['sorted-todo-list'],
    componentClass:SortedTodoList
  },
  {
    routePath:'dashboard',
    dataPath:['dashboard'],
    componentClass:Dashboard
  }
];

routes[1].subRoutes = [routes[0]];

const rootRoute = {
  routePath:'/home',
  dataPath:[],
  componentClass:Home,
  subRoutes:routes
};


// also import the middleware and apply to the store
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
}

import networkHandlers from './network/';

const { getDevice } = bootApp( [
  false? logger:networkMiddleware(networkHandlers)
] );


const getRoute = ({routePath, dataPath, componentClass, subRoutes=[]})=>(
  <Route path={routePath} key={routePath}
	 component={getDevice(componentClass, dataPath, componentClass.initState)}>
    {subRoutes.map(getRoute)}
  </Route>
);

const rcx = [rootRoute].map(getRoute);


render(
  <Router history={hashHistory} routes={rcx}/>,
  document.getElementById('root')
);
