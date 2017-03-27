import React from 'react';
import { fromJS } from 'immutable';
import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import { mount } from 'enzyme';

// component unit test
import TodoList from './index.js';
import { TodoListItem } from 'pure/TodoListItem/';

import { RemovableItem } from 'pure/RemovableItem';


import {
  bootStores,
  connectDeviceFactory,
} from 'tahini';

describe('TodoList', ()=>{

  const spyOnRemoveTodo = sinon.spy(TodoList.prototype, 'removeTodo');

  describe('shallow tests', ()=>{

    let p;

    beforeEach(()=>{
      p = mount( <TodoList subState={TodoList.initState} removeTodo={sinon.spy()}/> );
      spyOnRemoveTodo.reset();
    });

    it('renders the todos', ()=>{
      // used within RemovableItem
      const todoItems = p.find(TodoListItem);
      const todoLis = p.find('li');
      
      expect(todoItems).to.have.length(TodoList.initState.get('todos').size);
      expect(todoLis).to.have.length(TodoList.initState.get('todos').size);
    });

    it('shallow renders the todos as RemovableItems, binds removeTodo fn', ()=>{
      const items = p.find(RemovableItem);
      items.first().find('button').simulate('click');
      expect(spyOnRemoveTodo.calledOnce).to.be.ok;
    });

    it('renders an empty div when not given a subState', ()=>{
      const emptyP = mount( <TodoList/> );
      expect(emptyP.html()).to.eql('<div></div>');
    });
  });


  describe('connected tests', ()=>{

    let p, getDevice, appStore, BoundTodoList;

    const dataPath = [];
    
    beforeEach(()=>{
      const stores = bootStores();
      ({ getDevice } = connectDeviceFactory( stores ));
      ({ appStore } = stores);

      spyOnRemoveTodo.reset();
      
      BoundTodoList = getDevice(TodoList, dataPath, TodoList.initState);
      p = mount(<BoundTodoList/>);
    });

  
    it('mounts the todos as RemovableItems, and removes one', ()=>{
      const items = p.find(RemovableItem);
      expect(items).to.have.length(TodoList.initState.get('todos').size);
      
      items.first().find('button').simulate('click');
      
      expect(spyOnRemoveTodo.calledOnce).to.be.ok;
      
      const oneLessItems = p.find(RemovableItem);
      expect(oneLessItems).to.have.length(TodoList.initState.get('todos').size - 1);
      
    });
  });
});



// reducer & action unit test

describe('TodoList reducer', ()=>{

  it('adds a todo as reqd', ()=>{
    // initial State
    const iS = fromJS({todos:[{key:1, text:'blah'}]});

    const text = 'hmm'+Math.random();

    // expected State
    const xS = fromJS({todos:[{key:1, text:'blah'}, {key:0, text}]});

    // action to test with (technically this is an integration test)
    const action = TodoList.actions.addTodo(text);

    // next State as computed by the reducer
    const nS = TodoList.reducer[action.type](iS, action);

    // we can expect that the next State is as expected
    expect(nS).to.eql(xS);
  });

  it('removes a todo as reqd', ()=>{
    const iS = fromJS({todos:[{key:1, text:'blah'}]});

    const xS = fromJS({todos:[]});

    const action = TodoList.actions.removeTodo(1);

    const nS = TodoList.reducer[action.type](iS, action);

    expect(nS).to.eql(xS);
  });

  it('does nothing when removing non existant todo', ()=>{
    const iS = fromJS({
      todos:[
	{ text:'blah', key:0 },
	{ text:'hmm', key:1 }
      ]
    });

    const action = TodoList.actions.removeTodo(1337);

    const nS = TodoList.reducer[action.type](iS, action);
    expect(nS === iS).to.eql(true);
  });

  it('adds the first todo correctly', ()=>{
    const iS = fromJS({  });

    const action = TodoList.actions.addTodo('1337');
    const nS = TodoList.reducer[action.type](iS, action);
    const xS = fromJS({ todos:[{text:'1337', key:0}] });
    
    expect(xS).to.eql(nS);
  });

});
