export default [
  {
    name: 'pairs',
    hand: [
      { rank: 2, suit: 0 },
      { rank: 2, suit: 1 },
      { rank: 2, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 2, suit: 3 },
    value: 12,
  },
  
  {
    name: 'dibs',
    hand: [
      { rank: 4, suit: 0 },
      { rank: 2, suit: 1 },
      { rank: 6, suit: 2 },
      { rank: 11, suit: 3 },
    ],
    cut: { rank: 8, suit: 3 },
    value: 1,
  },

  {
    name: 'four flush hand',
    hand: [
      { rank: 4, suit: 3 },
      { rank: 2, suit: 3 },
      { rank: 6, suit: 3 },
      { rank: 11, suit: 3 },
    ],
    cut: { rank: 8, suit: 2 },
    value: 4,
  },
  
  {
    name: 'five flush hand',
    hand: [
      { rank: 4, suit: 3 },
      { rank: 2, suit: 3 },
      { rank: 6, suit: 3 },
      { rank: 10, suit: 3 },
    ],
    cut: { rank: 8, suit: 3 },
    value: 5,
  },

  {
    name: 'five flush crib',
    hand: [
      { rank: 4, suit: 3 },
      { rank: 2, suit: 3 },
      { rank: 6, suit: 3 },
      { rank: 11, suit: 3 },
      { rank: 8, suit: 3 },
    ],
    value: 5,
  },

];
