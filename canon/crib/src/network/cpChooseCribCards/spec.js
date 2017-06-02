import cpChooseCribCards from './';
import { fromJS } from 'immutable';

import { networkHandlers } from 'tahini';

const { it } = global;

const hand = fromJS([
  { rank: 2, suit: 1 },
  { rank: 4, suit: 1 },
  { rank: 4, suit: 3 },
  { rank: 6, suit: 1 },
  { rank: 6, suit: 2 },
  { rank: 7, suit: 1 },
]);

it('tests the request pattern', ()=>{
  // should write some cases for this (size, burns)
  
  const next = jest.fn();
  
  const dealer = new cpChooseCribCards(next);
  
  const action = {
    network:{
      handler:'cpChooseCribCards',
      payload: {
        hand,
        isCpCrib: true,
        target: 100,
      },
    },
  };

  dealer.handleRequest(action);
  
  expect(next.mock.calls.length).toEqual(1);

  // maybe actually test a scenario?
  expect(next.mock.calls[0][0].payload.hand.size).toEqual(4);
  expect(next.mock.calls[0][0].payload.crib.size).toEqual(2);

  expect(next.mock.calls[0][0].payload.crib.map( c=> c.get('rank')))
    .toEqual(fromJS([ 4, 4 ]));
  // keep 2, 6, 6, 7 to maximize scoring
});


it('chooses for low target', ()=>{
  // should write some cases for this (size, burns)
  
  const next = jest.fn();
  
  const dealer = new cpChooseCribCards(next);
  
  const action = {
    network:{
      handler:'cpChooseCribCards',
      payload: {
        hand,
        isCpCrib: false,
        target: 6,
      },
    },
  };

  dealer.handleRequest(action);
  
  expect(next.mock.calls.length).toEqual(1);

  // maybe actually test a scenario?
  expect(next.mock.calls[0][0].payload.hand.size).toEqual(4);
  expect(next.mock.calls[0][0].payload.crib.size).toEqual(2);


  expect(next.mock.calls[0][0].payload.crib.map( c=> c.get('rank')).sort())
    .toEqual(fromJS([ 4, 6 ]));
  // keep flush to maximize target odds
});
