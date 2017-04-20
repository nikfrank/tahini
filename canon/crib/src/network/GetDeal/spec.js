import GetDeal from './';

import { networkHandlers } from 'tahini';

const { it } = global;

it('tests the request pattern', ()=>{
  const next = jest.fn();
  
  const dealer = new GetDeal(next);
    
  const action = {
    network:{
      handler:'GetDeal',
      payload: { size: 5, burned: [] },
    },
  };

  dealer.handleRequest(action);
  
  expect(next.mock.calls.length).toEqual(1);
  expect(next.mock.calls[0][0].payload.length).toEqual(5);

});
