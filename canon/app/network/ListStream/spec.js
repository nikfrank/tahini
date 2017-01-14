import ListStream from './';

import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import { networkHandlers } from 'tahini';

describe('test for a poller', ()=>{
  it('tests the request pattern', (doneTest)=>{
    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();
    
    const listStream = new ListStream(next, done, err, {
      Poller:networkHandlers.Poller,
      Fetcher: networkHandlers.NoHandler
    });

    
    const stub = [{title:'whatever'}];


    const action = {
      network:{
	handler:'ListStream',
        interval:10
      },
      stub,
      nextAction:{}
    };


    listStream.handleRequest(action);

    setTimeout(()=>{
      expect(next.callCount).to.be.gt(1);
      
      expect(next).to.be.calledWith({payload:{list:[stub[0].title]}});

      const unsubAction = {
        network:{
	  handler:'ListStream',
          type:'unsubscribe'
        },
        stub,
        nextAction:{},
        doneAction:{}
      };


      listStream.handleRequest(unsubAction);

      expect(done).to.have.beenCalled;
      
      doneTest();
      
    }, 100);
  });
});
