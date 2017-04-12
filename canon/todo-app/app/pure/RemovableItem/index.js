import React from 'react';

import { TodoListItem } from '../TodoListItem';
import styles from './index.css';

export const RemovableItem = (props)=>{
  const { todo, removeTodo } = props;
  
  return (  
    <div className={styles.todo}>
      <TodoListItem todo={todo} {...props}/>
      <button onClick={removeTodo}>Remove {todo.get('text')}</button>
    </div>
  );  
};
