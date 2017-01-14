// the nextAction pattern should be refactored out of this network middleware

// any actionHandler who returns a promise can do a nextAction

// networkHandlers are more like observables
// so they should have an responseAction
// which gets triggered on any response in a stream

// either way though, the asynchronous behaviour is managed in middleware
// where the action instruction structure is managed entirely in the actioncreator.


// actions should be able to name the handler instance they wish to route to
// in order that downstream triggered actions can be collected through the same handler


import networkHandlers from './network-handlers/';

// intercept actions with a network field on them
// call the network handler and then dispatch a new action in the right lexical scope

// this needs a test for chained network actions

export default (Handlers, activeHandlers = {})=>
  store=> next=> action=>{

    const { network={}, type, payload, ...lexicalScope } = action;
    const { nextAction, doneAction, errAction, handler } = network;

    if(handler){
      if(!(handler in Handlers))
        throw `${handler} not found. Check that it has been declared and imported`;

      const dath = JSON.stringify(lexicalScope.dataPath);

      // resolve a request handler

      if(!(lexicalScope.namespace in activeHandlers)){
        activeHandlers[lexicalScope.namespace] = {};
      }

      if(!(dath in activeHandlers[lexicalScope.namespace])){
        activeHandlers[lexicalScope.namespace][dath] = {};
      }

      if(!(network.handler in activeHandlers[lexicalScope.namespace][dath])){

        activeHandlers[lexicalScope.namespace][dath][handler] =
          new Handlers[handler](
            response=>{
              store.dispatch({...lexicalScope, ...response, ...nextAction});
            },
            ()=>{
              if(doneAction) store.dispatch({...lexicalScope, ...doneAction});
              delete activeHandlers[lexicalScope.namespace][JSON.stringify(lexicalScope.dataPath)];
            },
            (err)=>{
              if (errAction) store.dispatch({...lexicalScope, ...err, ...errAction});
            },
            networkHandlers);
      }

      // find one that is for this provider
      // or instantiate a new one

      // using lexicalScope.namespace, datapath, 

      const activeHandler = activeHandlers[lexicalScope.namespace][dath][handler];

      // test and discuss
      if( type ){
        store.dispatch({type, payload, ...lexicalScope});
      }
      
      // call its handleRequest method
      return activeHandler.handleRequest(action); // w payload

    }else{
      return next(action);
    }
  };
