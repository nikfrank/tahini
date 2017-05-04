import React from 'react';

import Card, { CardBack } from './Card';

export default ({ cards=[], onClick, hidden }) => (
  <div className="Hand-Holder">
    <svg viewBox="0 0 1020 320">
      {
        cards.map( (card, i) =>
          hidden ? (
            <CardBack key={i} xOffset={i*80} yOffset={0} />
          ) : (
            <Card key={i+''+card.get('rank')+''+card.get('suit')}
                  onClick={()=> onClick(i)}
                  rank={card.get('rank')}
                  suit={card.get('suit')}
                  xOffset={i * 80}
                  yOffset={20 * !card.get('selected')} />
          ) )
      }
    </svg>
  </div>
);
