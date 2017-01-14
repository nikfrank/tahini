import Poller from './';

import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('polling handler', ()=>{
  it('starts polling, etc', (doneTest)=>{

    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();
    
    const testValue = 'whatever';
    const testUrl = 'some.thing';
    const testResponse = ()=>Promise.resolve(testValue);
    global.fetch = sinon.stub().returns( new Promise((resolve, rej)=>{
      setTimeout(()=>{
        resolve({
          status:200,
          json: testResponse
        });
      }, 50);
    }));
    const poll = new Poller(next, done, err);

    // spy on listWala.poll.handleRequest

    const action = {
      network:{
	handler:'Poller',
	url:testUrl,
        interval:10, // ms
	headers:{a:'b'}
      },
      nextAction:{}
    };

    const unsub = poll.handleRequest(action);
    
    // should test just that the requests are made
    // don't need to test that the headers get set and whatnot.

    setTimeout(()=>{
      expect(fetch).to.have.been.calledWith(testUrl);
      expect(fetch.firstCall.args[1].method).to.eql('GET');
      expect(fetch.firstCall.args[1].headers instanceof Headers).to.be.ok;
      expect(fetch.firstCall.args[1].headers.a).to.eql('b');

      expect(next.firstCall.args[0]).to.eql(testValue);
      
      expect(next).to.be.called; // timing prohibits counting accurately
      expect(err).to.be.not.called;


      expect(done).to.not.have.been.calledOnce;
      unsub();
      expect(done).to.have.been.calledOnce;
      
      doneTest();
    }, 100);
  });

  it('send back errors properly', (doneTest)=>{

    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();
    
    const testValue = 'whatever';
    const testUrl = 'some.thing';
    const testStatus = 400;
    const testResponse = ()=>Promise.resolve(testValue);
    global.fetch = sinon.stub().returns( new Promise((resolve, rej)=>{
      setTimeout(()=>{
        resolve({
          status:testStatus,
          json: testResponse
        });
      }, 50);
    }));
    const poll = new Poller(next, done, err);

    // spy on listWala.poll.handleRequest

    const action = {
      network:{
	handler:'Poller',
	url:testUrl,
        interval:10, // ms
	headers:{a:'b'}
      },
      nextAction:{}
    };

    const unsub = poll.handleRequest(action);

    setTimeout(()=>{
      expect(fetch).to.have.been.calledWith(testUrl);
      expect(fetch.firstCall.args[1].method).to.eql('GET');
      expect(fetch.firstCall.args[1].headers instanceof Headers).to.be.ok;
      expect(fetch.firstCall.args[1].headers.a).to.eql('b');

      expect(err.firstCall.args[0].body).to.eql(testValue);
      expect(err.firstCall.args[0].status).to.eql(testStatus);
      
      expect(next).to.not.be.called;
      expect(err).to.be.called;


      expect(done).to.not.have.been.calledOnce;
      unsub();
      expect(done).to.have.been.calledOnce;
      
      doneTest();
    }, 100);

  });
});


// also should test preunsub, calling handleRequest twice, changing the action midstream
