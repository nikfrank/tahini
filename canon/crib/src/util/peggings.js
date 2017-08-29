export default [
  {
    played: [{ card: { rank: 3, suit: 0 }, player: 0}],
    stack: [{ card: { rank: 3, suit: 0 }, player: 0}],
    score: 0,
    player: 0,
    count: 3,
    name: 'nothing',
  },

  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 3, suit: 1 }, player: 1},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 3, suit: 1 }, player: 1},
    ],
    score: 2,
    player: 1,
    count: 6,
    name: 'pair',
  },
  
  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { }, player: 1},
      { card: { rank: 3, suit: 1 }, player: 0},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { }, player: 1},
      { card: { rank: 3, suit: 1 }, player: 0},
    ],
    score: 2,
    player: 0,
    count: 6,
    name: 'my pair',
  },
  
  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 3, suit: 1 }, player: 1},
      { card: { rank: 3, suit: 2 }, player: 0},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 3, suit: 1 }, player: 1},
      { card: { rank: 3, suit: 2 }, player: 0},
    ],
    score: 6,
    player: 0,
    count: 9,
    name: 'triple',
  },
  
  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 3, suit: 1 }, player: 1},
      { card: { rank: 9, suit: 1 }, player: 0},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 3, suit: 1 }, player: 1},
      { card: { rank: 9, suit: 1 }, player: 0},
    ],
    score: 2,
    player: 0,
    count: 15,
    name: 'fifteen',
  },

  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 2, suit: 1 }, player: 1},
      { card: { }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 2, suit: 1 }, player: 1},
      { card: { }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
    ],
    score: 3,
    player: 1,
    count: 6,
    name: 'my 3-run ordered',
  },
  
  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 2, suit: 1 }, player: 1},
      { card: { rank: 1, suit: 1 }, player: 0},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 2, suit: 1 }, player: 1},
      { card: { rank: 1, suit: 1 }, player: 0},
    ],
    score: 3,
    player: 0,
    count: 6,
    name: '3-run ordered',
  },
  
  {
    played: [
      { card: { rank: 8, suit: 0 }, player: 1},
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 2, suit: 1 }, player: 1},
      { card: { rank: 1, suit: 1 }, player: 0},
    ],
    stack: [
      { card: { rank: 8, suit: 0 }, player: 1},
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 2, suit: 1 }, player: 1},
      { card: { rank: 1, suit: 1 }, player: 0},
    ],
    score: 3,
    player: 0,
    count: 14,
    name: 'later 3-run ordered',
  },
  
  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
      { card: { rank: 2, suit: 1 }, player: 0},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
      { card: { rank: 2, suit: 1 }, player: 0},
    ],
    score: 3,
    player: 0,
    count: 6,
    name: '3-run misordered',
  },
  
  {
    played: [
      { card: { rank: 11, suit: 0 }, player: 0},
      { card: { rank: 9, suit: 1 }, player: 1},
      { card: { rank: 10, suit: 1 }, player: 0},
    ],
    stack: [
      { card: { rank: 11, suit: 0 }, player: 0},
      { card: { rank: 9, suit: 1 }, player: 1},
      { card: { rank: 10, suit: 1 }, player: 0},
    ],
    score: 3,
    player: 0,
    count: 29,
    name: 'high 3-run misordered', // this had a string sort bug '10' < '9'!
  },
  
  {
    played: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
      { card: { rank: 2, suit: 0 }, player: 0},
      { card: { rank: 5, suit: 1 }, player: 1},
      { card: { rank: 4, suit: 0 }, player: 0},
      { card: { rank: 7, suit: 1 }, player: 1},
      { card: { rank: 6, suit: 0 }, player: 0},
    ],
    stack: [
      { card: { rank: 3, suit: 0 }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
      { card: { rank: 2, suit: 0 }, player: 0},
      { card: { rank: 5, suit: 1 }, player: 1},
      { card: { rank: 4, suit: 0 }, player: 0},
      { card: { rank: 7, suit: 1 }, player: 1},
      { card: { rank: 6, suit: 0 }, player: 0},
    ],
    score: 7,
    player: 0,
    count: 28,
    name: '7-run misordered',
  },

  {
    played: [
      { card: { rank: 12, suit: 0 }, player: 0},
      { card: { rank: 12, suit: 1 }, player: 1},
      { card: { rank: 12, suit: 2 }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
    ],
    stack: [
      { card: { rank: 12, suit: 0 }, player: 0},
      { card: { rank: 12, suit: 1 }, player: 1},
      { card: { rank: 12, suit: 2 }, player: 0},
      { card: { rank: 1, suit: 1 }, player: 1},
    ],
    score: 2,
    player: 1,
    count: 31,
    name: '31',
  },

  {
    played: [
      { card: { rank: 12, suit: 0 }, player: 0},
      { card: { rank: 12, suit: 1 }, player: 1},
      { card: { rank: 13, suit: 1 }, player: 0},
      { card: {}, player: 1},
      { card: {}, player: 0},
    ],
    stack: [
      { card: { rank: 12, suit: 0 }, player: 0},
      { card: { rank: 12, suit: 1 }, player: 1},
      { card: { rank: 13, suit: 1 }, player: 0},
      { card: {}, player: 1},
      { card: {}, player: 0},
    ],
    score: 1,
    player: 0,
    count: 30,
    name: 'go',
  },

];

// cases:
// play a card -> no points
// play a card -> over 31 ...?

// played a pair
// hit 15



// make sure run is at least three long when ending (with empties)
