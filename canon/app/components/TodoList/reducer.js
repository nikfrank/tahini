import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  todos: [
    {key:0, text:'blah'},
    {key:1, text:'hmm'},
    {key:2, text:'rawr'}
  ]
});

export { INITIAL_STATE as TodoListInitState };

const lowNextKey = (todos=fromJS([]))=>{
  const keys = todos.map(t=>t.get('key')).sort();
  for(let i=0; i<keys.size; ++i) if(i < keys.get(i)) return i;
  return keys.size;
};

const reducerHash = ({
  addTodo: (state, {
    payload:{ text, key = lowNextKey(state.get('todos')) }     })=>
      state.update('todos', (items = fromJS([]))=> items.push(fromJS({ key, text }))),

  // be careful with findIndex and removeIn. find returns -1 on nothing, but -1 is the last el!
  removeTodo: (state, {payload:{key}})=> (
    state.get('todos').findIndex(t=> t.get('key') === key) > -1
  )? state.removeIn(['todos', state.get('todos').findIndex(t=> t.get('key') === key) ]): state

});

export { reducerHash as TodoListReducer };
