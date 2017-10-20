import React from 'react';
import Scoreboard from './Scoreboard.js';

import handStyle from './handStyle.css';

import { Hand as PojoHand } from 'react-deck-o-cards';

const Hand = ({ cards, ...props })=> PojoHand(
  Object.assign({}, { cards: cards.toJS(), style: handStyle }, props)
);

export {
  Hand,
  Scoreboard,
};
