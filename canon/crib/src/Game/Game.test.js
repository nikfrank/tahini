import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';

import { Base } from 'tahini';

const { it } = global;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Game subState={ Game.initState }
                        getDevice={ jest.fn().mockReturnValue(Base) }/>, div);
});
