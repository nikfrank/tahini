// refactor into one big ugly reduce! [scoring fn, ..].reduce

export default (hand, cut = {}) => {
  const cards = hand.concat(cut);
  
  let total = 0;

  const dibsPts = hand.filter( ({ rank, suit }) => ((rank === 11) && (suit === cut.suit)) ).length;
  
  const pairPts = cards.reduce( (p, c, i) =>
    p + cards.slice(i + 1).filter( ({ rank }) => (rank === c.rank) ).length * 2, 0);


  const flushPts = (hand.reduce( (p, c) => (( p === c.suit ) ? p : -1), hand[0].suit) > -1) ?
                   cards.filter( ({ suit }) => (suit === hand[0].suit) ).length : 0;

  
  const runPattern = cards.sort((a, b) => (a.rank < b.rank) ? -1 : 1)
                          .map( (c, i, arr) => Math.min((arr[i+1] || {rank: NaN}).rank - c.rank, 2) )
                          .filter( n => !isNaN(n) ).join('').split('2')
                          .filter( d => (d.length > 1) )[0];
    
  const runPts = {
    '11': 3,
    '011': 6,
    '101': 6,
    '110': 6,

    '111': 4,
    '1110': 8,
    '1101': 8,
    '1011': 8,
    '0111': 8,

    '1111': 5,
    '1100': 9,
    '1001': 9,
    '0011': 9,
    
    '0101': 12,
    '0110': 12,
    '1010': 12,
  }[runPattern] || 0;
  
  total += dibsPts;
  total += pairPts;
  total += flushPts;
  total += runPts;

  return total;
};
