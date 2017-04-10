import React, { Component } from 'react';
import {render} from 'react-dom';

import TodoList from './components/TodoList/';
import SortedTodoList from './components/SortedTodoList/';
import Dashboard from './components/Dashboard/';

import './index.css';

import { bootApp, networkMiddleware } from 'tahini';

class Home extends Component {
  render(){
    console.log('blah');
    return (
      <div>
        blah
	{this.props.children}
      </div>
    );
  }
}


const routes = [
  {
    routePath:'/todo-list',
    dataPath:['todo-list'],
    componentClass:TodoList
  },
  {
    routePath:'/sorted-todo-list',
    dataPath:['sorted-todo-list'],
    componentClass:SortedTodoList
  },
  {
    routePath:'/dashboard',
    dataPath:['dashboard'],
    componentClass:Dashboard
  }
];

routes[1].subRoutes = [routes[0]];

const rootRoute = {
  routePath:'/home',
  dataPath:[],
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

render(
  bootApp( [ networkMiddleware(networkHandlers) ], routes ),
  document.getElementById('root')
);
