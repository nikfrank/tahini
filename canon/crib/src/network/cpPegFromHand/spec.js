import cpChooseCribCards from './';

import { networkHandlers } from 'tahini';

const { it } = global;

it('tests the request pattern', ()=>{
  // should write some cases for this (size, burns)
  
  const next = jest.fn();
  const done = jest.fn();
  
  const dealer = new cpChooseCribCards(next, done);
    
  const action = {
    network:{
      handler:'cpChooseCribCards',
      payload: { size: 5, burned: [] },
    },
  };

  dealer.handleRequest(action);
  
  expect(next.mock.calls.length).toEqual(1);
  expect(next.mock.calls[0][0].payload.length).toEqual(5);

});
