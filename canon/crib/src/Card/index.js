import React from 'react';

export default ({ card, fill, offset }) => (
  <use xlinkHref={`svg-cards.svg#${card}`}
       x={offset} y="10"
       fill={fill}/>
);
