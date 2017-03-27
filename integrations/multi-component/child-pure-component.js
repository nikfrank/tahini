import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(chaiImmutable);
chai.use(sinonChai);

import { mount } from 'enzyme';


import React from 'react';

import TodoList from '../../canon/app/components/TodoList';
import { RemovableItem } from '../../canon/app/pure/RemovableItem';

import { connectDeviceFactory, bootStores } from '../../test-index';

describe('widget with a pure child', ()=>{  
  //
  // before block
  //

  const stores = bootStores();
  const { getDevice } = connectDeviceFactory( stores );

  const { appStore } = stores;
  
  // spy on the todo list's removeTodo function
  const spyOnRemoveTodo = sinon.spy(TodoList.prototype, 'removeTodo');

  // this is redundant, unless the default prop changes in the implementation.
  TodoList.defaultProps.itemClass = RemovableItem;
  
  // mount a todolist
  const dataPath = ['multi-component', 'pure-child'];
  const BoundTodoList = getDevice( TodoList, dataPath, TodoList.initState );
  
  //
  // end before block
  //

  it('calls widget actions from pure-children', ()=>{
    const p = mount( <BoundTodoList/> );
    const items = p.find(RemovableItem);

    items.first().find('button').simulate('click');
    expect(spyOnRemoveTodo.calledOnce).to.be.ok;

    // expect the todo to have been removed from the state.
    expect(appStore.getState().getIn(dataPath.concat(['todos'])))
      .to.have
      .size(TodoList.initState.get('todos').size - 1);
  });

  
  it('renders widget data onto pure-children', ()=>{
    const p = mount( <BoundTodoList/> );
    const items = p.find(RemovableItem);

    // check that they have the todo text on the remove buttons
    expect(items.last().find('button').text())
      .to
      .contain( TodoList.initState.get('todos').last().get('text') );
  });
});
