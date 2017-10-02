import React from 'react';
import { fromJS } from 'immutable';

const seStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  color: 'red'
};

const divColor = ({ pts, player })=> ([0,1,2].map( pp=>
  Math.min( 255, player !== pp ? 0 : pts * 12 )
);

const divPerSE = ({ pts, total, player, color=divColor({pts, player}) }) => {
  if( ((total + pts) % 30) < (total % 30) ){
    return [
      divPerSE({
        pts: pts - ( (total + pts) % 30 ),
        total,
        player,
      }),
      divPerSE({
        pts: (total + pts) % 30,
        total: (total + pts) - ( (total + pts) % 30 ),
        player,
      }),
    ];
  } else {
    const edgeDim = ['top', 'right', 'bottom', 'left'][ Math.floor(total / 30) ];
    const runDim = ['left', 'top', 'right', 'bottom'][ Math.floor(total / 30) ];
    const thinDim = ['height', 'width'][ Math.floor(total / 30) % 2 ];
    const thickDim = ['width', 'height'][ Math.floor(total / 30) % 2 ];
    
    return {
      [edgeDim]: player,
      [runDim]: `${(total - (total % 30)) / 0.3}v${thickDim[0]}`,
      [thinDim]: 1,
      [thickDim]: `${pts / 0.3}v${thickDim[0]}`,

      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    };
  }
};

export default ({ scoring }) => {

  const [cpPts, myPts] = [0, 1].map(n =>
    scoring.filter( s => s.get('player') === n)
           .reduce( (p, c) => (p + c.get('pts')), 0) );

  const lastScore = scoring.last() || fromJS({});
  const lastScorePlayer = ['cp', 'me'][lastScore.get('player')] || null;

  const p1ScoringDivs = scoring
    .filter( s => s.get('player') === 1)
    .reduce((p, c)=> ({
        total: p.total + c.get('pts'),
        divs: p.divs.concat( divPerSE({
          pts: c.get('pts'),
          total: p.total,
          player:1,
        }) )
      }), { total: 0, divs: [] }
    ).divs;
  
  return (
    <div>
      {
        p1ScoringDivs.map( se => (
          <div style={{ ...seStyle, ...se }}/>
        ) )
      }
      <p>
        my pts: {myPts} cp pts: {cpPts}
        {
          lastScorePlayer ?
          ('  ' + lastScorePlayer +' + '+lastScore.get('pts')) : null
        }
      </p>
    </div>
  );
};
