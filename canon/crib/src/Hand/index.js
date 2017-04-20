import React from 'react';

import Card from '../Card/';

export default ({ cards, score }) => (
  <div>
    <svg width="850" height="400">
      {
        cards.map( (card, i) => (
          <Card key={i} rank={card.get('rank')} suit={card.get('suit')} offset={i*170} />
        ) )
      }
    </svg>
    <div>{score}</div>
  </div>
);
