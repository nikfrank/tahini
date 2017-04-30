import React from 'react';

const ranks = ['joker', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
const suits = ['club', 'diamond', 'heart', 'spade'];

export default ({ rank, suit, fill, xOffset, yOffset, onClick }) => (
  <use xlinkHref={`svg-cards.svg#${ranks[rank]}_${suits[suit]}`}
       onClick={onClick}
       x={xOffset} y={yOffset}
       fill={fill}/>
);

export const CardBack = ({ xOffset }) => (
  <use xlinkHref={'svg-cards.svg#back'} x={xOffset} y="20" />
);
