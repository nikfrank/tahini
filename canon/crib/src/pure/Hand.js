import React from 'react';

import Card, { CardBack } from './Card';

export default ({ cards=[], onClick, hidden }) => (
  <div className="Hand-Holder">
    <svg viewBox="0 0 1020 300">
      {
        cards.map( (card, i) =>
          hidden ? (
            <CardBack key={i} offset={i*170} />
          ) : (
            <Card key={i}
                  onClick={()=> onClick(i)}
                  rank={card.get('rank')}
                  suit={card.get('suit')}
                  selected={card.get('selected')}
                  offset={i*170} />
          ) )
      }
    </svg>
  </div>
);
