import { createStore } from 'redux';
import { fromJS } from 'immutable';

import {
  consumeActionByNamespace,
  addRelativePath
} from './util';

// boot the reflection reflection
export const createReflection = ()=>{

  const store = createStore(
    // should use dataPath/namespace reflection to enforce mount/dismount identity
    consumeActionByNamespace({
      global:{
        '@@redux/INIT': (state = fromJS({}), action)=> state,
        
        ascend: (s, a)=>{
          //console.log('a', s.toJS(), a);

          // upsert the action data onto the reflection (how to structure?)
          //console.log(a.payload.namespace, a.payload.dataPath);
          
          return s.setIn(a.payload.dataPath.concat(['.', a.payload.namespace, 'actions']),
                         fromJS(a.payload.actionNames));
        },
        
        descend: (s, a)=>{
          //console.log('d', s.toJS(), a.payload.dataPath.concat(['.', a.payload.namespace]));
          //console.log(a.payload.namespace, a.payload.dataPath);

          // find such a component on the reflection, remove it.
          // at this point if there are no devices mounted under ., ./.. should be removed as well
          
          const dot = a.payload.dataPath.concat(['.']);


          // this is wrong. also need to look underneath!...? (w ur hands)
          // the wrongness only matters when descending a parent while wanting to keep the child
          // so perhaps that imposition may stand for now.
          return ( (s.getIn(dot).size)-1 )?
                 s.removeIn(dot.concat([a.payload.namespace])):
                 s.removeIn(a.payload.dataPath);
        }
      }
    })
  );

  return {
    store,

    mountDevice: ({dataPath, namespace, actions})=> store.dispatch({
      type: 'ascend',
      payload:{
        dataPath,
        namespace: namespace,
        actionNames: Object.keys(actions)
      }
    })
  };
};


export const deviceReflectors =
  (reflection, dataPath, {namespace, actions}, triggerAction)=>{

    return {
      // reflection is independent of actually rendering the devices
      //  they are said to be in the reflection when they are gwc'd
      //  they are responsible for their own cleanup call.
      //     hopefully, a solution to this necessity can be found!
      
      getReflection: ()=>reflection.store.getState(),

      subscribeToReflectionStore: (cb)=>
        reflection.store.subscribe(e=> cb(reflection.store.getState())),
      
      queryReflection: ({relPath})=>
        reflection.store.getState().getIn( addRelativePath(dataPath, relPath).concat(['.']) ),
      
      // .evaluate here + relPath -> device at location
      // response device has exposed interface of actionCreators?
      
      triggerActionOnDevice: (relPath, targetNamespace, actionType, actionParams)=>{
        // use the reflection-query to resolve a target device
        const targetPath = addRelativePath(dataPath, relPath);


        // from here down should be a lower order function
        // trigger absolute action
        // which returns a curried actionTrigger function?
        // idk
        const availableActions =
          reflection
            .store
            .getState()
            .getIn( targetPath.concat(['.', targetNamespace, 'actions']) );

        if(!availableActions){
          throw ''+targetNamespace+' not found at ['+
          targetPath+'] when attempting to trigger '+actionType;
        }
        
        // check that the action exists
        else if( availableActions.contains( actionType ) ){
          // check that the action isn't in component.permissions.[...](...).prohibitedActions

          // make sure to graft on actionParams.origin = {dataPath, namespace}

          // as written, actinoParams is an array of arguments to spread!
          // noobs will fuck this up, strings will become spread char params. oh my!


          // call the action off the target component
          // graft on the target lexical scopes
          return triggerAction({
            dataPath: targetPath,
            namespace: targetNamespace,
            type: actionType,
            params: actionParams
          });
          
        } else {
          return false; // idk maybe
        }
      },

      abdicate: (targetNamespace = namespace, localPath = [])=>
        reflection.store.dispatch({
          type:'descend',
          payload:{
            dataPath: dataPath.concat(localPath),
            namespace: targetNamespace
          }
        })

      // convenience function for callActionOnSoloDevice (find unique class, call action...)
      // and for callActionOnDevices (query devices somehow, call action on all of them)?

      // also write cleanup into base components? possible?
    };
  };



// need to officially ban . .. / from being a dataPath part! (I'm ok withat)
// . is where the reflection keeps the "devices on this datapath"
// .. is means up in a relative path
// / is root of reflection (unimplemented because global is evil)

// I imagine this fucking someone over trying to use character entry as a hashkey
// meanwhile, that asshole can convert to a keycode or whatever.


// if component is instanceof Base or not I mean whatever srsly,
//  record into the reflectStore (componentName, dath, interfaces/actions, network dep?, ...)

// then pass this immutable reflectStore as a prop to everyone through a function, (efficient!)
// and also another function which lets other devices call actions on another device's scope.

// perhaps devices should declare which actions are private?

// if the devices declare interfaces, and those interfaces have tests which comprise such
// then the declarations can be confirmed by testing proctor.





/////////////////////////////////////////////////////
/*

   triggerActionWithOptimism: (relPath, actionType, actionParams)=>{
   // query the reflection (wet code)
   const targetPath = addRelativePath(dataPath, relPath);
   const hier = reflection.getState();
   const availableNamespaces = hier.getIn( targetPath.concat('.') );

   if(availableNamespaces.size !== 1){
   return false; // or reject, or throw... ?
   } else {
   const namespace = [...availableNamespaces.keys()][0];
   // how do I call triggerActionOnDevice?
   // triggerActionOnDevice(relPath, namespace, actionType, actionParams)
   // or better
   // triggerActionOnAbsolutePath( targetPath, namespace, ...)
   // probably have to define the functions about the assignment for it to be legible.

   // this is exactly the same logic as above and therefore will be refactored - not wetted
   const availableActions = availableNamespaces.getIn( [namespace, 'actions'] );
   }

   },

 */
