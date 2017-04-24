import React from 'react';

import Card from './Card';

export default ({ cards=[] }) => (
  <div>
    <svg width="890" height="400">
      {
        cards.map( (card, i) => (
          <Card key={i} rank={card.get('rank')} suit={card.get('suit')} offset={200+ i*170} />
        ) )
      }
    </svg>
  </div>
);
