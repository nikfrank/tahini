import cpChooseCribCards from './';
import { fromJS } from 'immutable';

import { networkHandlers } from 'tahini';

const { it } = global;

it('tests the request pattern', ()=>{
  // should write some cases for this (size, burns)
  
  const next = jest.fn();
  
  const dealer = new cpChooseCribCards(next);
    
  const action = {
    network:{
      handler:'cpChooseCribCards',
      payload: {
        hand: fromJS([
          { rank: 1, suit: 0 },
          { rank: 2, suit: 1 },
          { rank: 3, suit: 2 },
          { rank: 3, suit: 3 },
          { rank: 4, suit: 1 },
          { rank: 5, suit: 2 },
        ]),
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

});
