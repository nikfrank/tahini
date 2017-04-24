import React from 'react';
import ReactDOM from 'react-dom';
import Round from './Round';

const { it } = global;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Round subState={ Round.initState }/>, div);
});
