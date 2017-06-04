import React from 'react';

import Card, { CardBack } from './Card';

const handStyle = {
  maxHeight:'30vh',
  maxWidth:'96vw',
  padding:'2vw',
};

export default ({ cards=[], onClick, hidden }) => (
  <svg viewBox={'0 0 '+(100*(cards.size||1) + 70)+' 320'} style={handStyle}>
    {
      cards.map( (card, i) =>
        hidden ? (
          <CardBack key={i} xOffset={i*100} yOffset={0} />
        ) : (
          <Card key={i+''+card.get('rank')+''+card.get('suit')}
                onClick={()=> onClick(i)}
                rank={card.get('rank')}
                suit={card.get('suit')}
                xOffset={i * 100}
                yOffset={20 * !card.get('selected')} />
        ) )
    }
  </svg>
);
