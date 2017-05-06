export default (played) => {
  const { count, stack } = played.reduce( (p, c, {
    m: m = Math.min(10, c.card.rank||0)
  })=> (
    (p.count + m > 31) ?
    ({
      count: m,
      stack: [c],
    }) : ({
      count: p.count + m,
      stack: p.stack.concat(c),
    })
    
  ), { count: 0, stack: []});

  const lastCard = stack[stack.length-1];

  // if pair / triple / quad onScoringEvent( lastPlayer, 2 / 6 / 12 )
  
  let pairLength = 0;
  for (let i=stack.length; i-->0;) {
    if ( !('rank' in lastCard.card) ) break;
    else if ( stack[i].card.rank === lastCard.card.rank ) pairLength++;
    else break;
  }
  
  const pairPts = (pairLength - 1) * pairLength;
  
  // if count is 15, onScoringEvent( lastPlayer, 2 )
  const fifteenPts = (count === 15) ? 2 : 0;
  
  // if last N cards are consecutive onScoringEvent( lastPlayer, N )

  let runPts = 0;

  for ( let i = stack.length; i>2; i--){
    if ( stack.slice(-i)
              .map( c => c.card.rank )
              .sort()
              .reduce( (p, c, i, a) => ( p && ( (!i) || ( c - a[i-1] === 1)) ), true) ){
      runPts = i;
      break;
    }
  }

  // if count === 31 onScoringEvent( lastPlayer, 2 )
  const thirtyOnePts = (count === 31) ? 2 : 0;
  
  // if both players passed, the later one gets the point
  const secondLastCard = stack[stack.length-2];
  const goPts = (!lastCard || !secondLastCard) ? 0 :
                1*( !('rank' in lastCard.card || 'rank' in secondLastCard.card ) );

  const score = pairPts + fifteenPts + runPts + thirtyOnePts + goPts;
  const player = (lastCard||{}).player;

  return { score, player, count, stack };
};
