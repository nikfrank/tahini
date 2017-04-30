import React from 'react';

const ranks = ['joker', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
const suits = ['club', 'diamond', 'heart', 'spade'];

export default ({ rank, suit, fill, offset, selected, onClick }) => (
  <use xlinkHref={`svg-cards.svg#${ranks[rank]}_${suits[suit]}`}
       onClick={onClick}
       x={offset} y="10"
       stroke={selected ? 'orange' : 'none'}
       strokeWidth={2}
       fill={fill}/>
);

export const CardBack = ({ offset }) => (
  <use xlinkHref={'svg-cards.svg#back'} x={offset} y="10" />
);
