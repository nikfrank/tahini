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
  
  {
    name: 'five run',
    hand: [
      { rank: 9, suit: 2 },
      { rank: 10, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 13, suit: 3 },
    value: 5,
  },

  {
    name: 'four run',
    hand: [
      { rank: 7, suit: 2 },
      { rank: 10, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 13, suit: 3 },
    value: 4,
  },

  {
    name: 'three run',
    hand: [
      { rank: 9, suit: 2 },
      { rank: 8, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 13, suit: 3 },
    value: 3,
  },

  {
    name: '8pt three-double run',
    hand: [
      { rank: 9, suit: 2 },
      { rank: 10, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 10, suit: 2 },
    ],
    cut: { rank: 13, suit: 3 },
    value: 8,
  },

  {
    name: '10pt four-double run',
    hand: [
      { rank: 9, suit: 2 },
      { rank: 10, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 11, suit: 3 },
    value: 10,
  },
  
  {
    name: '15pt three-triple run',
    hand: [
      { rank: 11, suit: 1 },
      { rank: 10, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 11, suit: 3 },
    value: 15,
  },
  
  {
    name: '16pt three-double-double run',
    hand: [
      { rank: 10, suit: 2 },
      { rank: 10, suit: 3 },
      { rank: 11, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 11, suit: 3 },
    value: 16,
  },

  {
    name: 'fifteen two',
    hand: [
      { rank: 10, suit: 2 },
      { rank: 8, suit: 3 },
      { rank: 3, suit: 2 },
      { rank: 1, suit: 3 },
    ],
    cut: { rank: 5, suit: 3 },
    value: 2,
  },

  {
    name: 'fifteen two and a run of five',
    hand: [
      { rank: 1, suit: 2 },
      { rank: 2, suit: 3 },
      { rank: 3, suit: 2 },
      { rank: 4, suit: 3 },
    ],
    cut: { rank: 5, suit: 3 },
    value: 7,
  },
  
  {
    name: 'fifteen four',
    hand: [
      { rank: 10, suit: 2 },
      { rank: 9, suit: 3 },
      { rank: 3, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 5, suit: 3 },
    value: 4,
  },

  
  {
    name: 'fifteen six',
    hand: [
      { rank: 10, suit: 2 },
      { rank: 9, suit: 3 },
      { rank: 13, suit: 2 },
      { rank: 12, suit: 3 },
    ],
    cut: { rank: 5, suit: 3 },
    value: 6,
  },

  
  {
    name: 'fifteen eight',
    hand: [
      { rank: 7, suit: 2 },
      { rank: 8, suit: 1 },
      { rank: 7, suit: 3 },
      { rank: 8, suit: 0 },
    ],
    cut: { rank: 5, suit: 0 },
    value: 12,
  },
  
  {
    name: 'fifteen twelve',
    hand: [
      { rank: 7, suit: 2 },
      { rank: 7, suit: 1 },
      { rank: 7, suit: 3 },
      { rank: 1, suit: 0 },
    ],
    cut: { rank: 1, suit: 1 },
    value: 20,
  },
  
  {
    name: 'fifteen sixteen',
    hand: [
      { rank: 5, suit: 2 },
      { rank: 5, suit: 1 },
      { rank: 5, suit: 3 },
      { rank: 5, suit: 0 },
    ],
    cut: { rank: 10, suit: 1 },
    value: 28,
  },

  
  {
    name: 'perfect hand',
    hand: [
      { rank: 5, suit: 2 },
      { rank: 11, suit: 1 },
      { rank: 5, suit: 3 },
      { rank: 5, suit: 0 },
    ],
    cut: { rank: 5, suit: 1 },
    value: 29,
  },


  {
    name: '6 card two runs',
    hand: [
      { rank: 1, suit: 2 },
      { rank: 2, suit: 1 },
      { rank: 3, suit: 3 },
      { rank: 11, suit: 3 },
      { rank: 10, suit: 3 },
    ],
    cut: { rank: 9, suit: 1 },
    value: 12,
  },

  
  {
    name: 'crib good jack',
    hand: [
      { rank: 6, suit: 2 },
      { rank: 2, suit: 1 },
      { rank: 4, suit: 3 },
      { rank: 11, suit: 3 },
      { rank: 10, suit: 3 }, // was cut
    ],
    cut: { suit: 3 },
    value: 1,
  },
  
  {
    name: 'crib good jack',
    hand: [
      { rank: 11, suit: 3 },
      { rank: 11, suit: 0 },
      { rank: 3, suit: 2 },
      { rank: 13, suit: 0 },
      { rank: 9, suit: 3 }, // was cut
    ],
    cut: { suit: 3 },
    value: 3,
  },
];
