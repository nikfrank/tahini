import React from 'react';
import { fromJS } from 'immutable';

const legendStyle = {
  zIndex: 30,
  position: 'fixed',
  top: '4vh',
  right: '4vw',
  width: 200,
  maxWidth: '15vw',
  maxHeight: '15vh',
  color: 'white',
  textShadow: '-1px -1px 0 #000, '+
              '1px -1px 0 #000, '+
              '-1px 1px 0 #000, '+
              '1px 1px 0 #000',
  fontWeight: 900,
  fontSize: '3vh',
  letterSpacing: -0.5,
  backgroundColor: 'rgba(127,127,127,0.25)',
  borderRadius: 20,
  padding: 10,
  userSelect: 'none',
};

const legendRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const seStyle = {
  position: 'fixed',
  color: 'red',
  zIndex: 10,
};

const trackWidth = 5;

const divColor = ({ pts, player })=> ([0,1,2].map( pp=>
  Math.min( 255, (player + pp -1 <= 0) ? 0 : (100 + pts * 6) )
) );

const divPerSE = ({ pts, total, player, color=divColor({pts, player}) }) => {

  if( ((total + pts) % 30) && (((total + pts) % 30) < (total % 30) ) ){
    return [
      divPerSE({
        pts: pts - ( (total + pts) % 30 ),
        total,
        player,
        color,
      }),
      divPerSE({
        pts: (total + pts) % 30,
        total: (total + pts) - ( (total + pts) % 30 ),
        player,
        color,
      }),
    ];
  } else {
    const edgeDim = ['top', 'right', 'bottom', 'left'][ Math.floor(total / 30) % 4];
    const runDim = ['left', 'top', 'right', 'bottom'][ Math.floor(total / 30) % 4];
    const thinDim = ['height', 'width'][ Math.floor(total / 30) % 2 ];
    const thickDim = ['width', 'height'][ Math.floor(total / 30) % 2 ];
    
    return {
      [edgeDim]: player * trackWidth,
      [runDim]: `${(total % 30) / 0.3}v${thickDim[0]}`,
      [thinDim]: trackWidth,
      [thickDim]: `${pts / 0.3}v${thickDim[0]}`,

      border: `1px dashed rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.375)`,
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

  const scoringDivs = [0, 1].map(player =>
    scoring
      .filter( s => s.get('player') === player)
      .filter( s => s.get('pts') )
      .reduce((p, c)=> ({
        total: p.total + c.get('pts'),
        divs: p.divs.concat( divPerSE({
          pts: c.get('pts'),
          total: p.total,
          player: player,
        }) )
      }), { total: 0, divs: [] }
      ).divs
  );
  
  return (
    <div>
      {
        scoringDivs[0].map( (se, sei) => (
          <div key={'0'+sei} style={{ ...seStyle, ...se }}/>
        ) )
      }
      
      {
        scoringDivs[1].map( (se, sei) => (
          <div key={'1'+sei} style={{ ...seStyle, ...se }}/>
        ) )
      }
          {
            lastScorePlayer ? (
              <div style={legendStyle}>
                <div style={legendRowStyle}>
                  <span>me</span><span>{myPts}</span>
                </div>
                <div style={legendRowStyle}>
                  <span>cp</span><span>{cpPts}</span>
                </div>
                <div style={legendRowStyle}>
                  <span>
                    {'' + lastScorePlayer }
                  </span>
                  <span>{' + '}</span>
                  <span>
                    {lastScore.get('pts')}
                  </span>
                </div>
              </div>
            ): null
          }
    </div>
  );
};
