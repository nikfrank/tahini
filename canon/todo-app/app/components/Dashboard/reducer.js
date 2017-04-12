import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  devices:{
    'hash0':{ text:'blah', race:'TodoList' },
    'hash1':{ text:'hmm', race:'SortedTodoList', listItemRace:'TodoListItem' },
    'hash2':{ text:'rawr', race:'TodoList', listItemRace:'TodoListItem' },
    'hash3':{ text:'tsk', race:'SortedTodoList', active:true }
  }
});

export { INITIAL_STATE as DashboardInitState };

const reducerHash = ({
  createDevice: (state, {payload:{race, text}, ...action})=>{
    // make up a hash
    const hash = 'hash'+Math.random();
    return state.setIn(['devices', hash], fromJS({race, text}))
  },
  
  destroyDevice: (state, {payload:{key}, ...action})=>
    state.update('devices', w=> w.remove(key)),

  resetDevice: (state, {payload:{key, type, initState}, ...action})=>
    state.setIn(['devices', key, type], initState),
  
  activateDevice: (state, {payload:{key}, ...action})=>{
    const prev = state.get('devices').findKey(w=> w.get('active'));
    
    if(prev === key) return state;
    if(typeof state.getIn(['devices', key]) === 'undefined') return state;
    
    return state.removeIn(['devices', prev, 'active']).setIn(['devices', key, 'active'], true);
  }
});

export { reducerHash as DashboardReducer };
