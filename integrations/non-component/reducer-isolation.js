import { expect } from 'chai';

import { createStore } from 'redux';
import { fromJS } from 'immutable';

import {
  Base,
  baseReducerHash,
  
  consumeActionByNamespace,
  isolateMutationByDataPath,
  applyPartialAction
} from '../../test-index';


describe('reducer isolation, ie namespacing', ()=>{


  // action + reducer, action + reducer + namespace
  
  it('applies the reducer in the sub-state', ()=>{
    const initState = fromJS({});


    const reducer = (state = initState, action)=> state.set('path', fromJS(action.payload));
    const actionWithoutDataPath = { payload:{blah:'hmm'} };
    
    const unisolatedXstate = fromJS({ path: actionWithoutDataPath.payload });
    const unisolatedState = reducer(undefined, actionWithoutDataPath);
    
    expect(unisolatedState).to.eql(unisolatedXstate);


    
    // isolatedReducers only act on initialized states
    // a result of this is that the state must be initd before gwi'ing onto the path

    let dataPath = ['a','b','c'];
    
    const isolatedReducer = isolateMutationByDataPath(reducer);
    const actionWithDataPath = { ...actionWithoutDataPath, dataPath };
    
    const isolatedXstate = initState.setIn(dataPath, unisolatedXstate);
    const isolatedState = isolatedReducer(initState, actionWithDataPath);

    // unisolatedReducer doesn't change
    expect(reducer(undefined, actionWithDataPath)).to.eql(unisolatedXstate);

    // isolatedReducer is isolated to its dataPath
    expect(isolatedState).to.eql(isolatedXstate);
  });





  // store, action + reducer + namespace
  
  it('prints and consumes action namespaces', (done)=>{
    const setResult = (payload)=>({ type:'setResult', payload });
    
    const namespacedACs = applyPartialAction({ namespace:Base.namespace })({ setResult });

    // prints namespace on action
    const Naction = namespacedACs.setResult();
    expect(Naction.namespace).to.eql(Base.namespace);


    // initialize a reducer with one action-handler on the namespace
    // calling the baseReducerHash is a means to isolate tests from eachother!
    const reducer = {
      ...baseReducerHash(),

      [Base.namespace]: {
	setResult: (state, action)=>{
	  // expect the namespace to be consumed before getting to the reducer
	  expect(action.namespace).to.not.be.ok;
	  return state.set('result', action.payload);
	}
      },
    };

    // initialize store from reducer
    const store = createStore( consumeActionByNamespace( reducer ) );


    // once the setResult action is dispatched, expect 
    const unsubscribe = store.subscribe(()=>{
      const nuState = store.getState();
      expect(nuState.get('result')).to.eql('payload');
      
      done();
      unsubscribe();
    });


    store.dispatch(namespacedACs.setResult('payload'));
  });




  
  // store, initState, action + reducer, isolator
  
  it('initializes and isolates the namespaced reducer onto a substate', (done)=>{    
    const setResult = (payload)=>({ type:'setResult', payload });
    
    const dataPath = ['data', 'path'];
    const initState = fromJS(Base.initState);
    
    const namespacedACs = applyPartialAction({ namespace:Base.namespace, dataPath })({ setResult });

    // prints namespace on action
    const Naction = namespacedACs.setResult();
    expect(Naction.namespace).to.eql(Base.namespace);
    
    const reducer = {
      ...baseReducerHash(),

      [Base.namespace]: {
	setResult: (state, action)=>{
	  // consumed it before getting to the reducer
	  expect(action.namespace).to.not.be.ok;
	  return state.set('result', action.payload);
	}
      },
    };

    // create the store with isolated reducer and namespaced actions
    const store = createStore( isolateMutationByDataPath( consumeActionByNamespace( reducer ) ) );


    const testPayload = fromJS({test:'payload'});
    
    let nextAction = 'setSubState';
    
    const unsubscribe = store.subscribe(()=>{
      const nuState = store.getState();

      if(nextAction === 'setSubState'){ // first time through, initg substate
	expect(nuState.getIn(dataPath)).to.eql(initState);
	nextAction = 'action';
	
      } else if(nextAction === 'action'){ // second action, settingResult
	expect(nuState.getIn(dataPath.concat(['result']))).to.eql(testPayload);
	done();
	unsubscribe();
      }
    });

    // this is magically the same as initStateOnDataPath from createInjector
    // as is the store initialization
    store.dispatch({
      type:'setSubState', namespace:'global', path:dataPath, payload: initState
    });

    
    store.dispatch(namespacedACs.setResult(testPayload));
  });
});
