import React from 'react';

const ranks = ['joker', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
const suits = ['club', 'diamond', 'heart', 'spade'];

const displayRanks = ['*', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


const suitTokens = [
  (<g>
    <path d="M3.35,4.66c0-1.81-1.51-3.28-3.38-3.28s-3.38,1.47-3.38,3.28c0,1.81,1.51,3.28,3.38,3.28S3.35,6.47,3.35,4.66z"/>
    <path d="M7.71-1.55c0-1.81-1.51-3.28-3.38-3.28S0.95-3.36,0.95-1.55c0,1.81,1.51,3.28,3.38,3.28S7.71,0.26,7.71-1.55z"/>
    <path d="M-0.95-1.57c0-0.66-0.2-1.28-0.55-1.8c-0.6-0.89-1.65-1.48-2.83-1.48c-1.87,0-3.38,1.47-3.38,3.28 c0,1.81,1.51,3.28,3.38,3.28S-0.95,0.24-0.95-1.57z"/>
    <path d="M3.94-7.94c-1.67,0-2.55,1.36-3.01,2.72C0.47-3.86,0.43-2.5,0.43-2.5h-0.86c0,0-0.16-5.43-3.5-5.44H3.94z"/>
    <path d="M-2.32,2.25c1.9-1.9,1.9-4.75,1.9-4.75l0.85-0.01c0,0,0,2.91,1.85,4.76"/>
    <path d="M-1.94-3.85c1.9,1.9,4.75,1.9,4.75,1.9v0.85c0,0-2.91,0-4.76,1.85"/>
    <path d="M1.87-3.86c-1.9,1.9-4.75,1.9-4.75,1.9v0.85c0,0,2.91,0,4.76,1.85"/>
  </g>),
  
  (<g>
    <path style={{fill:'#e6180a'}}
          d="M0,0C-2.56,0-5.12,0-7.68,0C -6.8053,0.039-6.061,0.605-5.358,1.0728C-3.779,2.264-2.3,3.63 -1.132,5.228C-0.587,6.032 -0.0144,6.936 0,7.94M-7.68,0C-6.57,-0.035 -5.622,-0.7413 -4.776,-1.393C-3.281,-2.648 -1.987,-4.141 -0.895,-5.757C-0.494,-6.426 -0.022,-7.135 0,-7.94C0,-5.293 0,-2.647 0,0M0,-7.94C0.038,-6.758 0.758,-5.734 1.438,-4.82C2.65,-3.310 4.086,-1.974 5.666,-0.857C6.28,-0.474 6.932,-0.0185 7.68,0C5.12,0 2.56,0 0,0M 7.68,0C6.57,0.035 5.622,0.741 4.776,1.392C 3.281,2.648 1.987,4.141 0.895,5.757C0.494,6.426 0.0225,7.135 0,7.94C0,5.293 0,2.647 0,0"/>
  </g>),

  (<g>
    <path style={{fill: '#e6180a'}}
          d="M-7.67,3.93c0.01-4.71,5.91-8.14,7.64-11.87c1.75,3.72,7.66,7.12,7.7,11.83c0.01,2.22-1.71,4.03-3.82,4.03C1.73,7.92,0,6.13,0,3.91c0,2.23-1.71,4.03-3.82,4.03C-5.94,7.95-7.66,6.15-7.67,3.93z"/>
  </g>),

  (<g>
    <path d="M3.92-7.93c-1.67,0-2.55,1.78-3.01,3.56c-0.46,1.78-0.5,3.56-0.5,3.56L-0.44-0.8c0,0-0.16-7.13-3.5-7.13H3.92z"/>
    <path d="M6.75-0.8C6.74,2.67,1.53,5.19,0,7.93C-1.53,5.18-6.74,2.66-6.75-0.8c0-1.64,1.51-2.97,3.38-2.97C-1.51-3.77,0-2.44,0-0.8c0-1.64,1.51-2.97,3.38-2.97S6.75-2.44,6.75-0.8z"/>
  </g>),
];


const suitFills = [
  '#ddddee', 'white', '#ffe6cc', 'white',
];


export default ({ rank, suit, fill, xOffset, yOffset, onClick }) => (
  <g transform={`translate(${xOffset}, ${yOffset})`} onClick={onClick}>
    <rect width={170} height={158}
          x={0} y={0}
          rx={20} ry={20}
          fill={suitFills[suit]}
          stroke="black"/>

    <text fontWeight="bold"
          transform={'translate(7, 40) '+ (
              (rank!==10) ? '' : 'scale(0.5, 1)' )}
          fontFamily="monospace"
          fill={((suit+1) % 4) < 2 ? 'black': '#e6180a'}
          style={{ cursor: 'default' }}
          fontSize={43}>
      {displayRanks[rank]}
    </text>
    <g transform={`translate(${21},${60}) rotate(180)`}>
      {suitTokens[suit]}
    </g>
    
  </g>
);


const path = ({ x1, y1, xc1, yc1, xc2, yc2, x2, y2 })=>
  `M ${x1} ${y1} C ${xc1} ${yc1}, ${xc2} ${yc2}, ${x2} ${y2}`;

const isntOffCorner = (cx, cy, r)=>
  ((cx >= 20) && (cx <= 150)) ||
  ((cy >= 20) && (cy <= 138)) ? true : (

    Math.pow(
      Math.pow( 65 - Math.abs( 85 - cx ), 2) +
      Math.pow( 59 - Math.abs( 79 - cy ), 2), 0.5
    ) + r < 20
  );

const r256 = ()=> Math.floor(Math.random()*256);
const seedColors = [
  `rgb(${r256()}, ${r256()}, ${r256()})`,
  `rgb(${r256()}, ${r256()}, ${r256()})`,
  `rgb(${r256()}, ${r256()}, ${r256()})`,
];

let circles = [];

Array(50).fill(1).forEach((o, oi, arr)=> {
  const r = Math.abs( Math.random()*30 -12 );
  const op = Math.random()*0.5 + 0.375;
  
  let cx, cy;
  let tries = 20;
  
  do {
    cx = r +2 + Math.random()*(170 - 2*r - 4);
    cy = r +2 + Math.random()*(158 - 2*r - 4);
    
  } while (
    (--tries) && (
      !isntOffCorner(cx, cy, r+3) ||
      circles.filter(p => (
        Math.pow(p.cx-cx, 2) + Math.pow(p.cy-cy, 2)) < Math.pow(p.r + r + 4, 2)).length
    )
  );

  if(tries) circles.push({ cx, cy, r, op });
});



export const CardBack = ({ xOffset }) => (
  <g transform={`translate(${xOffset}, 0)`}>
    <rect width={170} height={158}
          x={0} y={0}
          rx={20} ry={20}
          fill={seedColors[2]}
          stroke="black"/>
    {
      circles.map(({ cx, cy, r, op }, ki)=> (
        <circle key={ki} r={r}
                cx={cx} cy={cy}
                fill={seedColors[0]}
                stroke={seedColors[1]}
                opacity={op}
                strokeWidth={2}/>
      ) )
    }
  </g>
);



//  <use xlinkHref={'svg-cards.svg#back'} x={xOffset} y="20" />

const dep =  ({ rank, suit, fill, xOffset, yOffset, onClick }) => (

  <use xlinkHref={`svg-cards.svg#${ranks[rank]}_${suits[suit]}`}
       onClick={onClick}
       x={xOffset} y={yOffset}
       fill={fill}/>
);
