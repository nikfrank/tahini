const { it, expect } = global;

import pegScore from './pegScore';

import peggings from './peggings';

peggings.forEach(({ played, stack, score, player, count, name }) =>
  it(`pegScores: ${name}`, ()=>{
    const result = pegScore(played);
    expect( result.score ).toEqual( score );
    expect( result.player ).toEqual( player );
    expect( result.count ).toEqual( count );
    expect( result.stack ).toEqual( stack );
  })
);
