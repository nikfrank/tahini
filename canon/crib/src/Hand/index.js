import React from 'react';

import Card from '../Card/';

export default ({ cards, cut, score }) => (
  <div>
    <svg width="890" height="400">
      <Card rank={cut.get('rank')} suit={cut.get('suit')} offset={0} />
      {
        cards.map( (card, i) => (
          <Card key={i} rank={card.get('rank')} suit={card.get('suit')} offset={200+ i*170} />
        ) )
      }
    </svg>
    <div>{score}</div>
  </div>
);
