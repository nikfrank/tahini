import NoHandler from './';

import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('null handler', ()=>{
  it('should call next, because it does nothing!', ()=>{
    const next = sinon.spy();
    const done = sinon.spy();

    // make a null handler for testing?
    
    const noHandler = new NoHandler(next, done);

    // spy on listWala.fetcher.handleRequest

    const stub = {};
    
    const action = {
      network:{ handler:'NoHandler' },
      stub
    };


    noHandler.handleRequest(action);

    expect(next).to.have.been.calledWith(stub);
    expect(done).to.have.been.calledOnce;
  });
});
