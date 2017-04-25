import React from 'react';

import Card from './Card';

export default ({ cards=[], onClick }) => (
  <div>
    <svg width="1020" height="300">
      {
        cards.map( (card, i) => (
          <Card key={i}
                onClick={()=> onClick(i)}
                rank={card.get('rank')}
                suit={card.get('suit')}
                offset={i*170} />
        ) )
      }
    </svg>
  </div>
);
