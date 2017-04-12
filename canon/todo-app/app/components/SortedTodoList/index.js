import React from 'react';

import TodoList from '../TodoList/';

import { actions } from './actions';
import { reducer, initState } from './reducer';

import styles from './index.css';

class SortedTodoList extends TodoList {
  static get actions(){
    return {...super.actions, ...actions};
  }
  
  static get reducer(){
    return {...super.reducer, ...reducer};
  }
  
  static get namespace(){
    return 'tahini.canon.SortedTodoList';
  }
  
  static get initState(){
    return super.initState.merge(initState);
  }

  
  toggleSortDirection(){
    this.props.setDirection(this.props.subState.get('direction') === 'asc' ? 'desc':'asc');
  }

  andThenSort(fn){
    return (...args)=>{
      fn(...args);
      this.props.setDirection(this.props.subState.get('direction'));
    };
  }

  componentWillUnmount(){
    // without this, the abdicate will fire twice (due to subclassing)
    // thus, we would be fucking up the reflection!

    // ie subclassing is evil.
  }
  
  // this should be rewritten as GCI in componentWillMount
  render() {
    const {subState, addTodo, ...props} = this.props;
    
    return (
      <div className={styles.sortedTodoList}>
	Sorted {subState.get('direction') === 'asc' ? 'alphabetical':'anti-alpha'}
	<button onClick={this.toggleSortDirection.bind(this)} className={styles.toggle}>
	  Toggle
	</button>

	<TodoList subState={subState} addTodo={this.andThenSort(addTodo)} {...props} />
	{this.props.children}
      </div>
    );
  }
}
export default SortedTodoList;
