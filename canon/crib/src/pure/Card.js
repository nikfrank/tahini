import React from 'react';

const ranks = ['joker', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
const suits = ['club', 'diamond', 'heart', 'spade'];

export default ({ rank, suit, fill, xOffset, yOffset, onClick }) => (
  <g>
    <rect width={170} height={160}
          onClick={onClick}
          x={xOffset} y={yOffset}
          rx={20} ry={20}
          fill="white" stroke="black"/>

    <text onClick={onClick}
          x={xOffset} y={yOffset+20}
          fontSize={25}>
      {rank}{suits[suit][0].toUpperCase()}
    </text>
    
    <use xlinkHref={`svg-cards.svg#${ranks[rank]}_${suits[suit]}`}
         onClick={onClick}
         x={xOffset} y={yOffset}
         fill={fill}/>
  </g>
);

export const CardBack = ({ xOffset }) => (
  <use xlinkHref={'svg-cards.svg#back'} x={xOffset} y="20" />
);
