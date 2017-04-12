import ListWala from './';

import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import { networkHandlers } from 'tahini';

describe('test for an api network handler', ()=>{
  it('tests the request pattern', ()=>{
    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();
    
    const listWala = new ListWala(next, done, err, { Fetcher: networkHandlers.NoHandler });

    const fetchHandler = sinon.spy(listWala.fetcher, 'handleRequest');
    
    const stub = [{title:'whatever'}];

    // spy on listWala.fetcher.handleRequest

    const action = {
      network:{
	handler:'ListWala'
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
