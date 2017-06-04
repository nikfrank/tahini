import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';

import { createReflection } from './reflection';

import {
  consumeActionByNamespace,
  isolateMutationByDataPath,
} from './util';

export const baseReducerHash = ()=>({
  global:{
    '@@redux/INIT': (state = fromJS({}), action)=> state,
    '@@INIT': (state = fromJS({}), action)=> state,
    setSubState: (state, action)=> state.setIn(action.path, action.payload)
  }
});


// takes middleware
// returns reducerHash, appStore
export const bootStores = function(middleware = [], reducerHash = baseReducerHash()){
  const actionCreatorHash = {};

  const appStore = createStore(
    isolateMutationByDataPath( consumeActionByNamespace(reducerHash) ),
    compose(
      applyMiddleware(...middleware),
      window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ) );

  // boot the reflection
  const reflection = createReflection();

  return {
    appStore, reflection, actionCreatorHash, reducerHash
  };
};
