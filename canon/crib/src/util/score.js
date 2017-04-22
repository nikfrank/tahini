// refactor into one big ugly reduce! [scoring fn, ..].reduce

export default (hand, cut = {}) => {
  const cards = hand.concat(cut);
  
  let total = 0;

  const dibsPts = hand.filter( ({ rank, suit }) => ((rank === 11) && (suit === cut.suit)) ).length;
  
  const pairPts = cards.reduce( (p, c, i) =>
    p + cards.slice(i + 1).filter( ({ rank }) => (rank === c.rank) ).length * 2, 0);


  const flushPts = (hand.reduce( (p, c) => (( p === c.suit ) ? p : -1), hand[0].suit) > -1) ?
                   cards.filter( ({ suit }) => (suit === hand[0].suit) ).length : 0;
  
  total += dibsPts;
  total += pairPts;
  total += flushPts;

  return total;
};
