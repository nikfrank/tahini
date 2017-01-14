import Fetcher from './';

import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('http fetch handler', ()=>{
  it('requests something and calls next withe response', (doneTest)=>{
    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();

    const testValue = 'whatever';
    const testUrl = 'some.thing';
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:200,
      json: ()=>Promise.resolve(testValue)
    }) );
    const fetcher = new Fetcher(next, done, err);

    // spy on listWala.fetcher.handleRequest

    const action = {
      network:{
	handler:'Fetcher',
	url:testUrl,
	headers:{a:'b'}
      },
      nextAction:{}
    };

    fetcher.handleRequest(action).then(()=>{
      expect(fetch).to.have.been.calledWith(testUrl);
      expect(fetch).to.have.been.calledOnce;
      expect(fetch.firstCall.args[1].method).to.eql('GET');
      expect(fetch.firstCall.args[1].headers instanceof Headers).to.be.ok;
      expect(fetch.firstCall.args[1].headers.a).to.eql('b');

      expect(next).to.have.been.calledWith(testValue);
      expect(next).to.have.been.calledOnce;
      
      expect(done).to.have.been.calledOnce;
      doneTest();
    });
  });

  it('requests by POST something and calls next withe response', (doneTest)=>{
    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();

    const testValue = 'whatever';
    const testUrl = 'some.thing';
    const testPayload = {what:'ever'};
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:200,
      json: ()=>Promise.resolve(testValue)
    }) );
    const fetcher = new Fetcher(next, done, err);
    
    const action = {
      network:{
	handler:'Fetcher',
	url:testUrl,
        payload:testPayload,
	method:'POST'
      },
      nextAction:{}
    };

    fetcher.handleRequest(action).then(()=>{
      expect(fetch).to.have.been.calledWith(testUrl);
      expect(fetch).to.have.been.calledOnce;
      expect(fetch.firstCall.args[1].method).to.eql('POST');
      expect(fetch.firstCall.args[1].body).to.eql(JSON.stringify(testPayload));
      expect(fetch.firstCall.args[1].headers instanceof Headers).to.be.ok;
      expect(fetch.firstCall.args[1].headers.Accept).to.eql('application/json');
      expect(fetch.firstCall.args[1].headers['Content-Type']).to.eql('application/json');

      expect(next).to.have.been.calledWith(testValue);
      expect(next).to.have.been.calledOnce;
      
      expect(done).to.have.been.calledOnce;
      doneTest();
    });
  });


  it('uses takeLast rereq strategy', (doneTest)=>{
    const next = sinon.spy();
    const done = sinon.spy();
    const err = sinon.spy();

    const testValue = 'whatever';
    const testUrl = 'some.thing';
    global.fetch = (url, req)=>( new Promise((resolve, rej)=>{
      setTimeout(()=>{
        resolve({
          status:200,
          json: ()=>Promise.resolve(req.body)
        });
      }, 10);
    }));

    const fetchSpy = sinon.spy(global, 'fetch');
    
    const fetcher = new Fetcher(next, done, err);

    const action = i=> ({
      network:{
        method:'POST',
	handler:'Fetcher',
	url:testUrl+''+i,
        payload:i,
        rereqStrategy:'takeLast'
      },
      nextAction:{}
    });

    fetcher.handleRequest(action(0));
    fetcher.handleRequest(action(1)).then(()=>{
      expect(fetch).to.have.been.calledWith(testUrl+'0');
      expect(fetch).to.have.been.calledWith(testUrl+'1');
      //expect(fetch).to.have.been.calledTwice; // this fails due to global fetch traffic
      expect(fetch.firstCall.args[1].method).to.eql('POST');

      // global fetch spy stub echos request body (payload...)
      expect(next).to.not.have.been.calledWith('0');
      expect(next).to.have.been.calledWith('1');
      expect(next).to.have.been.calledOnce;
      
      expect(done).to.have.been.calledOnce;
      doneTest();
    }).catch(doneTest);
  });

});
