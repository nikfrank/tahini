import React from 'react';

const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
const suits = ['club', 'diamond', 'heart', 'spade'];

export default ({ rank, suit, fill, offset }) => (
  <use xlinkHref={`svg-cards.svg#${ranks[rank]}_${suits[suit]}`}
       x={offset} y="10"
       fill={fill}/>
);
