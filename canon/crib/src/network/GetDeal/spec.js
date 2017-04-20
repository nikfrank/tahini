import TestHTTP from './';

import { networkHandlers } from 'tahini';

describe('test for an api network handler', ()=>{
  it('tests the request pattern', ()=>{
    const next = jest.fn();
    const done = jest.fn();
    const err = jest.fn();
    
    const listWala = new TestHTTP(next, done, err, { Fetcher: networkHandlers.NoHandler });

    const fetchHandler = jest.fn(listWala.fetcher, 'handleRequest');
    
    const stub = [{title:'whatever'}];

    // spy on listWala.fetcher.handleRequest

    const action = {
      network:{
	handler:'TestHTTP'
      },
      stub,
      nextAction:{}
    };


    listWala.handleRequest(action);

    
    // test that the fetcher wala was called with the mock response
    expect(next).to.be.calledWith({payload:{list:[stub[0].title]}});

    // expect that the listWala assigned a url to action.network.url
    expect(fetchHandler.firstCall.args[0].network.url).to.be.ok;
    
  });
});
