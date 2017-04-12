import React from 'react';

import styles from './index.css';

export const TodoListItem = (props)=>{
  return (
    <div className={styles.todo}>
      {props.todo.get('text')}
    </div>
  );  
};
