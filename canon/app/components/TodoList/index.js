import React from 'react';
import { Base } from 'tahini';

import styles from './index.css';

import { RemovableItem } from '../../pure/RemovableItem/';

import { TodoListActions } from './actions';
import { TodoListReducer, TodoListInitState } from './reducer';

class TodoList extends Base {
  static get actions(){
    return TodoListActions;
  }
  
  static get reducer(){
    return TodoListReducer;
  }
  
  static get namespace(){
    return 'tahini.canon.todo-list';
  }
  
  static get initState(){
    return TodoListInitState;
  }

  static get defaultProps(){
    return { itemClass: RemovableItem, exposures:{} };
  }
  
  componentWillMount(){
    this.state = {value:''};

    this.props.exposures.removeTodo = this.removeTodo.bind(this);
  }
  
  componentWillReceiveProps(){
    //console.log(this.props);
  }
  
  handleChange(e){
    this.setState({value:e.target.value});
  }

  addTodo(){
    this.props.addTodo(this.state.value);
    this.setState({value:''});
  }

  removeTodo(key){
    this.props.removeTodo(key);
  }


  componentWillUnmount(){
    this.props.abdicate();
  }
  
  render() {
    if(!this.props.subState) return (<div></div>);

    const ItemClass = this.props.itemClass;
    const destroySelf = e=>{
      e.stopPropagation();
      return this.props.destroySelf();
    }
    
    return (
      <ul className={styles.todoList}>
	{this.props.subState.get('todos').toArray().map(todo=>
	  <li key={todo.get('key')}>
	    <ItemClass todo={todo}
		       removeTodo={this.removeTodo.bind(this, todo.get('key'))}/>
	  </li>
	 )}
	  <input value={this.state.value} onChange={this.handleChange.bind(this)}/>
	  <button className={styles.add} onClick={this.addTodo.bind(this)}>add</button>
	  <button className={styles.destroy} onClick={destroySelf}>destroy self</button>
      </ul>
    );
  }
}
export default TodoList;
