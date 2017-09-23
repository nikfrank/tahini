import React from 'react';

import Card, { CardBack } from './Card';

import handStyle from './handStyle.css';

export default ({ cards=[], onClick, hidden, style={} }) => (
  <svg viewBox={'0 0 '+(100*(cards.size||1) + 70)+' 160'}
       style={{ ...handStyle, ...style }}>
    {
      cards.map( (card, i) => (
        !card.get('rank') ? null : (

          hidden ? (
            <CardBack key={i} xOffset={i*100} yOffset={20} />
          ) : (
            <Card key={card.get('rank')+''+card.get('suit')}
                  onClick={()=> onClick(i)}
                  rank={card.get('rank')}
                  suit={card.get('suit')}
                  xOffset={i * 100}
                  yOffset={20 * !card.get('selected')} />
          ) ) )
      )
    }
  </svg>
);
