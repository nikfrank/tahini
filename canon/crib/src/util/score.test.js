const { it, expect } = global;

import score from './score';

// write test case (hand)
// expect it to score correctly

// for each case, commit and push (for article)

import cases from './cases';

cases.forEach(({ hand, cut, value }) =>
  it('calculates the score for each hand correctly', ()=>{
    expect( score(hand, cut) ).toEqual( value );
  })
);
