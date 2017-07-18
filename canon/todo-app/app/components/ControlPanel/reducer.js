import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  list:[]
});

export { INITIAL_STATE as initState };


const reducer = ({
  setList: (state, {payload:{list}, ...action})=>
    state.set('list', fromJS(list)),

  setListSimple: (state, {payload: list, ...action})=>
    state.set('listSimple', fromJS(list.map(i => i.title))),

  setListMock: (state, {payload: list, ...action})=>
    state.set('listMock', fromJS(list.map(i => i.title))),

  notifyUnsubscribe: (state, action)=>
    state.update('lastUnsubscribe', 0, k=>k+1)
});

export { reducer };
