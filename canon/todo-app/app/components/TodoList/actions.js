const actions = {
  addTodo: (text)=>({
    type:'addTodo', payload:{text}
  }),

  removeTodo: (key)=>({
    type:'removeTodo', payload:{key}
  })

};

export { actions as TodoListActions };
