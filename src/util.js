import { fromJS } from 'immutable';

// consume the namespace from the action on dispatch
// this explains how to turn a reducerHash into a reducer
export const consumeActionByNamespace = reducerHash=>
  (state, {namespace='global', ...action})=>
    reducerHash[namespace][action.type](state, action);


// consume the dataPath, scope the mutation to the mount point
export const isolateMutationByDataPath = reducer=>
  (state = fromJS({}), {dataPath=[], ...action})=>
    state.setIn( dataPath, reducer(state.getIn(dataPath), action ) );

export const applyPartialAction = (partial)=> (actions)=>
  Object.keys(actions).reduce((p,c)=>
    ({...p, [c]: (...args)=> ({...actions[c](...args), ...partial}) }), {});

export const addRelativePath = (dataPath, relPath)=>{
  let fullPath = [].concat(dataPath);
  relPath.forEach(part=> (part === '..')? fullPath.pop(): fullPath.push(part));
  return fullPath;
};


// testing util
export const getNextState = store => ()=> (
  new Promise((s, j)=>{
    const f = store.subscribe(()=>{
      f();
      s(store.getState());
    });
  }) );

export const toJS = state => state.toJS();

export const rejectify = fn => state => {
  try{
    fn(state);
    return Promise.resolve();
  } catch(e) {
    return Promise.reject(e);
  }
};
