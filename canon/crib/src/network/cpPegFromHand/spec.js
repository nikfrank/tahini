import cpPegFromHand from './';

import { networkHandlers } from 'tahini';

const { it } = global;

it('tests the request pattern', ()=>{
  // should write some cases for this (size, burns)
  
  const next = jest.fn();
  const done = jest.fn();
  
  const peg = new cpPegFromHand(next, done);
    
  const action = {
    network:{
      handler:'cpPegFromHand',
      payload: {
        hand:[
          { rank: 10, suit: 0 },
          { rank: 10, suit: 1 },
          { rank: 10, suit: 2 },
          { rank: 1, suit: 3 },
        ],
        played: [],
      },
    },
  };

  peg.handleRequest(action);
  
  expect(next.mock.calls.length).toEqual(1);
  const play = next.mock.calls[0][0].payload;

  expect(play.length).toEqual(2);
  
  expect(play[0]).toEqual(0);
  expect(play[1] < 4).toEqual(true);
});
