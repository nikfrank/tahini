import React from 'react';
import { render } from 'react-dom';
import { bootApp, networkMiddleware } from 'tahini';

import App from './App';
import './index.css';

import networkHandlers from './network/';

const RootP = bootApp(
  [ networkMiddleware(networkHandlers) ]
).getDevice(App, [], App.initState);

render(
  <RootP/>,
  document.getElementById('root')
);
