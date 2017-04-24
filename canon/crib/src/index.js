import React from 'react';
import { render } from 'react-dom';
import { bootApp, networkMiddleware } from 'tahini';

import Game from './Game/';
import './index.css';

import networkHandlers from './network/';

const RootP = bootApp(
  [ networkMiddleware(networkHandlers) ]
).getDevice(Game, [], Game.initState);

render(
  <RootP/>,
  document.getElementById('root')
);
