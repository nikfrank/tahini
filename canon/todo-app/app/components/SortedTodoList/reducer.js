import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({ direction:'asc' });

export { INITIAL_STATE as initState };

const reducerHash = ({
  setDirection: (state, {payload:{direction}, ...action})=>
    state.set('direction', direction)
	 .update('todos', todos=>
	   (direction === 'asc'?
	    todos.sortBy(i=> i.get('text')):
	    todos.sortBy(i=> i.get('text')).reverse()))

});

export { reducerHash as reducer };
