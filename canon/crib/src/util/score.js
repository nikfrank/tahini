// refactor into one big ugly reduce! [scoring fn, ..].reduce

export default (hand, cut = {}) => {
  const cards = hand.concat(cut);
  
  let total = 0;

  const dibsPts = hand.filter( ({ rank, suit }) => ((rank === 11) && (suit === cut.suit)) ).length;
  
  const pairPts = cards.reduce( (p, c, i) =>
    p + cards.slice(i + 1).filter( ({ rank }) => (rank === c.rank) ).length * 2, 0);


  const flushPts = (hand.reduce( (p, c) => (( p === c.suit ) ? p : -1), hand[0].suit) > -1) ?
                   cards.filter( ({ suit, rank }) => ((suit === hand[0].suit) && (rank > 0)) ).length : 0;

  
  const runPatterns = cards.sort((a, b) => (a.rank < b.rank) ? -1 : 1)
                           .map( (c, i, arr) => Math.min((arr[i+1] || {rank: NaN}).rank - c.rank, 2) )
                           .filter( n => !isNaN(n) ).join('').split('2')
                           .filter( d => (d.length > 1) );
  
  const runPts = runPatterns.map(runPattern =>
    (
      (runPattern.match(/1/g)||[]).length < 2
    ) ? 0 : (
      (1 + runPattern.match(/1/g).length) * runPattern
        .split('1').reduce( (p, c) => p * (c.length + 1), 1)
    )
  ).reduce( (p, c) => p + c, 0);


  // this filter is for crib scoring, which needs a test case
  const ranks = cards.map( c => Math.min(10, c.rank) ).filter( r => !isNaN(r));

  const fifteenPts =
    Array( Math.pow(2, ranks.length) - 1)
      .fill(1).map( (d, i) => ( Array(ranks.length).join('0')+(i+1).toString(2))
        .slice(-1 * ranks.length).split('') )
      .filter( b =>
        (b.reduce( (p, c, i) => (p + (1 * c) * ranks[i]), 0 ) === 15)
      ).length * 2;

  total += dibsPts;
  total += pairPts;
  total += flushPts;
  total += runPts;
  total += fifteenPts;
  
  return total;
};
