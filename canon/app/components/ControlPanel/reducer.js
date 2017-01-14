import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  list:[]
});

export { INITIAL_STATE as initState };


const reducer = ({
  setList: (state, {payload:{list}, ...action})=>
    state.set('list', fromJS(list)),

  notifyUnsubscribe: (state, action)=>
    state.update('lastUnsubscribe', 0, k=>k+1)
});

export { reducer };
