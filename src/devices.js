import { createElement } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import {
  createReflection,
  deviceReflectors
} from './reflection';

import {
  consumeActionByNamespace,
  isolateMutationByDataPath,
  applyPartialAction
} from './util';

export const baseReducerHash = ()=>({
  global:{
    '@@redux/INIT': (state = fromJS({}), action)=> state,
    setSubState: (state, action)=> state.setIn(action.path, action.payload)
  }
});

export const connectToLexicalScope = ({dataPath, namespace}, actions)=>
  connect(
    state=> ({ subState: state.getIn(dataPath) }), // map rootState -> subState
    applyPartialAction({dataPath, namespace})(actions)
  );


export const bootApp = function(middleware = [], reducerHash = baseReducerHash()){
  const actionCreatorHash = {};
  
  const appStore = createStore(
    isolateMutationByDataPath( consumeActionByNamespace(reducerHash) ),
    applyMiddleware(...middleware)
  );

  const initStateOnDataPath = (dataPath, subState)=>
    appStore.dispatch({type:'setSubState', path:dataPath, payload:fromJS(subState)});
  
  const updateStateOnDataPath = (dataPath, updater)=>
    initStateOnDataPath(dataPath, updater(appStore.getState().getIn(dataPath)));



  // boot the reflection reflection
  const reflection = createReflection();

  const getDevice = (deviceClass, dataPath = [], initStateOrUpdater)=>{
    
    actionCreatorHash[deviceClass.namespace] = deviceClass.actions;
    
    reflection.mountDevice({
      dataPath,
      namespace:deviceClass.namespace,
      actions:deviceClass.actions
    });

    
    if(typeof initStateOrUpdater === 'object') initStateOnDataPath(dataPath, initStateOrUpdater);
    else if(typeof initStateOrUpdater === 'function') updateStateOnDataPath(dataPath, initStateOrUpdater);

    // import the reducer
    if(!(deviceClass.namespace in reducerHash))
      reducerHash[deviceClass.namespace] = deviceClass.reducer;

    const device = connectToLexicalScope({
      dataPath, namespace:deviceClass.namespace
    }, deviceClass.actions)( deviceClass );

    device.defaultProps = {
      store: appStore,
      
      // hierarchical deviceClass instancing
      getDevice: (deviceClass, localPath, deviceInitState)=>
        getDevice(deviceClass, dataPath.concat(localPath), deviceInitState),

      
      //reflection
      ...deviceReflectors(reflection, dataPath, deviceClass, ({
        dataPath: targetPath,
        namespace: targetNamespace,
        type: actionType,
        params: actionParams
      })=> {
        const finalAction = {
          ...actionCreatorHash[targetNamespace][actionType](...actionParams),
          dataPath: targetPath,
          namespace:targetNamespace,
          origin: { dataPath, namespace:deviceClass.namespace }
        };

        // this could be refactored into a printOn?
        
        return appStore.dispatch(finalAction);
      })
    };

    return device;
  };

  return {
    getDevice, appStore, reflection, reducerHash,
    initStateOnDataPath, updateStateOnDataPath
  };
};




// implement global cache context, deviceClass reducer cleanup
