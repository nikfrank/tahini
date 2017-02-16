import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  connectDeviceFactory,
  bootStores,
  
  networkMiddleware,
  networkHandlers
} from '../../test-index';

//import ListWala from '../../canon/app/network/ListWala';


describe('networkMiddleware', ()=>{
  it('has a working fetch handler, non-duplicating', (done)=>{
    expect(networkHandlers).to.be.ok;

    const testValue = 'blah';    
    global.fetch = sinon.stub().returns( new Promise((resolve, rej)=>{
      setTimeout(()=>{
        resolve({
          status:200,
          json: ()=>Promise.resolve(testValue)
        });
      }, 150);
    }));
    
    expect(fetch).to.be.ok;

    const { Fetcher } = networkHandlers;

    expect(Fetcher).to.be.ok;

    const next = sinon.spy();
    const err = sinon.spy();
    
    const fetcher = new Fetcher(next, ()=>{
      expect(next).to.be.calledOnce;
      expect(err.callCount).to.be.eql(0);
      expect(next).to.be.calledWith(testValue);
      done();
    }, err);

    expect(fetcher).to.be.ok;

    // call the fetcher directly
    // expect next to've been called, expect done to've been called
    // but only once! even though I'm calling twice.

    const reqs = [
      fetcher.handleRequest({network:{ url:testValue }}),
      fetcher.handleRequest({network:{ url:testValue }}) 
    ];

    expect(reqs[0] === reqs[1]).to.be.ok;
    
    Promise.all(reqs).then(()=> expect(fetch).to.be.calledWith(testValue))
           .catch(done);
  });


  it('fetch handler calls errAction', (done)=>{
    expect(networkHandlers).to.be.ok;

    const testValue = 'blah';    
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:400,
      json: ()=>Promise.resolve(testValue)
    }) );
    
    expect(fetch).to.be.ok;

    const { Fetcher } = networkHandlers;

    expect(Fetcher).to.be.ok;

    const next = sinon.spy();
    const err = sinon.spy();
    
    const fetcher = new Fetcher(next, ()=>{
      expect(err).to.be.calledOnce;
      expect(next.callCount).to.be.eql(0);
      expect(err.firstCall.args[0].body).to.be.eql(testValue);
      expect(err.firstCall.args[0].status).to.be.eql(400);
      done();
    }, err);

    expect(fetcher).to.be.ok;

    // call the fetcher directly
    // expect next to've been called, expect done to've been called
    // but only once! even though I'm calling twice.
    
    fetcher.handleRequest({network:{ url:testValue }});
    fetcher.handleRequest({network:{ url:testValue }});

    expect(fetch).to.be.calledWith(testValue);
  });


  
  it('resolves network handlers, then directs requests to them, dispatch nextAction', (done)=>{
    // initiate the middleware with handler
    // mock dispatching an action with a .network, test the same things

    const testValue = 'blah';    
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:200,
      json: ()=>Promise.resolve({data:testValue})
    }) );
    
    const middleware = networkMiddleware(networkHandlers);

    // mock dispatching an action without a .network to make sure it isn't intercepted

    const next = sinon.spy();
    const store = {dispatch: sinon.spy()};

    const action = {
      network:{ handler:'Fetcher' },
      nextAction:{}
    };
    
    const req = middleware(store)(next)(action);
    
    req.then(()=>{
      expect(store.dispatch).to.be.calledOnce; // once for the nextAction
      expect(fetch).to.be.calledOnce;
      done();
    }).catch(done);
  });
  
  it('dispatches next and done', (done)=>{
    // initiate the middleware with handler
    // mock dispatching an action with a .network, test the same things

    const testValue = 'blah';    
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:200,
      json: ()=>Promise.resolve({data:testValue})
    }) );
    
    const middleware = networkMiddleware(networkHandlers);

    // mock dispatching an action without a .network to make sure it isn't intercepted

    const next = sinon.spy();
    const store = {dispatch: sinon.spy()};

    const action = {
      network:{
        handler:'Fetcher',
        nextAction:{type:'next'},
        errAction:{type:'err'},
        doneAction:{type:'done'}
      }
    };
    
    const req = middleware(store)(next)(action);
    
    req.then(()=>{
      expect(store.dispatch).to.be.calledTwice; // once for nextAction, once for doneAction
      expect(store.dispatch.firstCall.args[0].type).to.eql('next');
      expect(store.dispatch.secondCall.args[0].type).to.eql('done');
      expect(fetch).to.be.calledOnce;
      done();
    }).catch(done);
  });

  it('dispatches err and done', (done)=>{
    const testValue = 'blah';    
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:400,
      json: ()=>Promise.resolve({data:testValue})
    }) );
    
    const middleware = networkMiddleware(networkHandlers);

    // mock dispatching an action without a .network to make sure it isn't intercepted

    const next = sinon.spy();
    const store = {dispatch: sinon.spy()};

    const action = {
      network:{
        handler:'Fetcher',
        nextAction:{type:'next'},
        errAction:{type:'err'},
        doneAction:{type:'done'}
      }
    };
    
    const req = middleware(store)(next)(action);
    
    req.then(()=>{
      expect(store.dispatch).to.be.calledTwice; // once for nextAction, once for doneAction
      expect(store.dispatch.firstCall.args[0].type).to.eql('err');
      expect(store.dispatch.secondCall.args[0].type).to.eql('done');
      expect(fetch).to.be.calledOnce;
      done();
    }).catch(done);
  });

  
  it('reuses the activeHandler namespace', ()=>{
    const activeHandlers = {};
    
    const middleware = networkMiddleware(networkHandlers, activeHandlers);

    const next = sinon.spy();

    const namespace = 'some-widget';
    
    const action1 = {
      network:{ handler:'Fetcher' },
      nextAction:{},
      namespace,
      dataPath:[]
    };
    
    middleware('store')(next)(action1);

    expect(Object.keys(activeHandlers[namespace])).to.have.length(1);

    const action2 = {
      network:{ handler:'Fetcher' },
      nextAction:{},
      namespace,
      dataPath:['datapath']
    };
    
    middleware('store')(next)(action2);

    expect(Object.keys(activeHandlers[namespace])).to.have.length(2);    
  });

  
  it('reuses the handler which already exists', ()=>{
    const activeHandlers = {};
    
    const middleware = networkMiddleware(networkHandlers, activeHandlers);

    const next = sinon.spy();
    
    const namespace = 'some-widget';
    
    const action1 = {
      network:{ handler:'Fetcher' },
      nextAction:{},
      namespace,
      dataPath:[]
    };
    
    middleware('store')(next)(action1);

    expect(Object.keys(activeHandlers[namespace])).to.have.length(1);
    
    const action2 = {
      network:{ handler:'Fetcher' },
      nextAction:{},
      namespace,
      dataPath:[]
    };
    
    middleware('store')(next)(action1);

    expect(Object.keys(activeHandlers[namespace])).to.have.length(1);
  });


  it('calls preflight actions', ()=>{
    const activeHandlers = {};
    
    const middleware = networkMiddleware(networkHandlers, activeHandlers);

    const next = sinon.spy();
    const store = {dispatch: sinon.spy()};
    
    const testPayload = 'payload';
    const testDataPath = 'dath';
    const testNamespace = 'namespace';
    
    const action = {
      type:'type',
      payload:testPayload,
      network:{
        handler:'Fetcher'
      },
      nextAction:{},
      dataPath:testDataPath,
      namespace:testNamespace
    };
    
    const req = middleware(store)(next)(action);


    expect(Object.keys(activeHandlers)).to.have.length(1);
    expect(next).to.not.be.called;
    
    expect(store.dispatch).to.be.calledOnce;
    expect(store.dispatch.firstCall.args[0].type).to.eql('type');
    expect(store.dispatch.firstCall.args[0].payload).to.eql(testPayload);
    expect(store.dispatch.firstCall.args[0].dataPath).to.eql(testDataPath);
    expect(store.dispatch.firstCall.args[0].namespace).to.eql(testNamespace);
  });

  it('passes over actions without .network', ()=>{
    const activeHandlers = {};
    
    const middleware = networkMiddleware(networkHandlers, activeHandlers);

    const next = sinon.spy();
    
    const action = {
      nextAction:{}
    };
    
    const req = middleware('store')(next)(action);

    // check that no active handlers exist, and that next has been called

    expect(Object.keys(activeHandlers)).to.have.length(0);
    expect(next).to.be.calledOnce;
  });

  
  it('integrates withe framework injector, errs on non-existant handler', ()=>{
    const activeHandlers = {};

    const stores = bootStores( [
      networkMiddleware(networkHandlers, activeHandlers)
    ] );

    const { appStore } = stores;
    const { getDevice } = connectDeviceFactory( stores );

    let isError = false;

    try{
      appStore.dispatch({
        network:{
          handler:'DOES NOT EXIST'
        }
      });
    }catch(e){
      isError = true;
    }

    expect(isError).to.be.ok;
    
    // then check the active handlers
    // check the spies on fetch
    // check the passover

    
    // finish this for "200%" code coverage.
  });
});
