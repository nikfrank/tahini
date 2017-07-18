import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  connectDeviceFactory,
  bootStores,
  
  networkMiddleware,

  simpleHTTP,
} from '../../test-index';


describe('simpleHTTP', ()=>{
  it('basic get request', (done)=>{
    expect(simpleHTTP).to.be.ok;

    const testResponse = 'blah';
    const testURL = 'blah.go';
    
    global.fetch = sinon.stub().returns( new Promise((resolve, rej)=>{
      setTimeout(()=>{
        resolve({
          status:200,
          json: ()=>Promise.resolve(testResponse)
        });
      }, 150);
    }));
    
    expect(fetch).to.be.ok;

    const next = sinon.spy();
    const err = sinon.spy();
    
    const fetcher = new (simpleHTTP.get(testURL))(next, ()=>{
      expect(next).to.be.calledOnce;
      expect(err.callCount).to.be.eql(0);
      expect(next).to.be.calledWith({ payload: testResponse });
      done();
    }, err);

    expect(fetcher).to.be.ok;

    // call the fetcher directly
    // expect next to've been called, expect done to've been called
    // but only once! even though I'm calling twice.

    const reqs = [
      fetcher.handleRequest({ network: { handler: 'simpleFetch' } }),
      fetcher.handleRequest({ network: { handler: 'simpleFetch' } })
    ];

    expect(reqs[0] === reqs[1]).to.be.ok;
    
    Promise.all(reqs)
           .then(()=> expect(fetch).to.be.calledWith(testURL))
           .catch(done);
  });


  
  it('basic get request from payload -> query params', (done)=>{
    expect(simpleHTTP).to.be.ok;

    const testResponse = 'blah';
    const testQuery = { q: 'google this!' };
    const testURL = 'blah.go';
    
    global.fetch = sinon.stub().returns( new Promise((resolve, rej)=>{
      setTimeout(()=>{
        resolve({
          status:200,
          json: ()=>Promise.resolve(testResponse)
        });
      }, 150);
    }));
    
    expect(fetch).to.be.ok;

    const next = sinon.spy();
    const err = sinon.spy();
    
    const fetcher = new (simpleHTTP.get(testURL))(next, ()=>{
      expect(next).to.be.calledOnce;
      expect(err.callCount).to.be.eql(0);
      expect(next).to.be.calledWith({ payload: testResponse });
    }, err);

    expect(fetcher).to.be.ok;

    // call the fetcher directly
    // expect next to've been called, expect done to've been called
    // but only once! even though I'm calling twice.

    const reqs = [
      fetcher.handleRequest({
        network: {
          handler: 'simpleFetch',
          payload: testQuery,
        },
      }),
      
      fetcher.handleRequest({
        network: {
          handler: 'simpleFetch',
          payload: testQuery,
        },
      }),
    ];
    
    expect(reqs[0] === reqs[1]).to.be.ok;
    
    Promise.all(reqs)
           .then(()=> expect(fetch)
             .to.be
             .calledWith(testURL+'?q='+encodeURIComponent('google this!'))
           )
           .then(()=> done())
           .catch(done);
  });

  // I'm skipping the rest of the fetcher tests, as simpleHTTP is using that
  // needs at least one for POST, PUT
  
  // I'll move right on to testing the mock


  it('makes a mock handler from provided data', (done)=>{

    const testResponse = ['blah', 'hmm'];
    const next = sinon.spy();
    const err = sinon.spy();
    
    const mock = new (simpleHTTP.mock( testResponse ))(next, pon =>{
      expect(next).to.be.calledOnce;
      expect(err.callCount).to.be.eql(0);
      expect(next).to.be.calledWith({ payload: testResponse });
      done();
    }, err);


    mock.handleRequest();
    
  });


  
});
