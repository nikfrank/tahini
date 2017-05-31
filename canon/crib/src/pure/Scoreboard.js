import React from 'react';
import { fromJS } from 'immutable';

export default ({ scoring }) => {

  const [cpPts, myPts] = [0, 1].map(n =>
    scoring.filter( s => s.get('player') === n)
           .reduce( (p, c) => (p + c.get('pts')), 0) );

  const lastScore = scoring.last() || fromJS({});
  const lastScorePlayer = ['cp', 'me'][lastScore.get('player')] || null;
  
  return (
    <div>
      <p>my pts: {myPts} cp pts: {cpPts}</p>
      {
        lastScorePlayer ?
        <p>{lastScore.get('pts')} to {lastScorePlayer}</p> : null
      }
    </div>
  );
};
