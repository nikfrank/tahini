// refactor into one big ugly reduce! [scoring fn, ..].reduce

export default (hand, cut) => {
  let total = 0;

  const dibsPts = hand.filter( ({ rank, suit }) => ((rank === 11) && (suit === cut.suit)) ).length;
  
  const cards = hand.concat(cut);
  
  const pairPts = cards.reduce( (p, c, i) =>
    p + cards.slice(i + 1).filter( ({ rank }) => (rank === c.rank) ).length * 2, 0);

  total += dibsPts;
  total += pairPts;

  return total;
};
