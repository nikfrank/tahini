import React from 'react';
import { fromJS } from 'immutable';

export default ({ scoring }) => {

  const [cpPts, myPts] = [0, 1].map(n =>
    scoring.filter( s => s.get('player') === n)
           .reduce( (p, c) => (p + c.get('pts')), 0) );

  const lastScore = scoring.last() || fromJS({});
  const lastScorePlayer = ['cp', 'me'][lastScore.get('player')] || null;
  
  return (
    <p>
      my pts: {myPts} cp pts: {cpPts}
      {
        lastScorePlayer ?
        ('  ' + lastScorePlayer +' + '+lastScore.get('pts')) : null
      }
    </p>
  );
};
