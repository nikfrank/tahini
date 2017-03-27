import { expect } from 'chai';

import React from 'react';
import { mount } from 'enzyme';

import TodoList from '../../canon/app/components/TodoList';

import { connectDeviceFactory, bootStores } from '../../test-index';

describe('component action isolation', ()=>{
  it('namespaces the component action creators', ()=>{

    const stores = bootStores();

    const { appStore } = stores;
    const { getDevice } = connectDeviceFactory( stores );

    const Device = getDevice(TodoList, [], TodoList.initState);
    
    const el = mount(React.createElement(Device));
    const addTodoAC = el.node.mergedProps.addTodo;
    const action = addTodoAC('test-item');

    expect(action.namespace).to.eql(TodoList.namespace);
    expect(action.dataPath).to.eql([]);
    
    // also test that it de-isolates the reducer correctly?
    // perhaps there's no evil in repetitive testing.

    const st = appStore.getState();

    expect(st.get('todos').last().get('text')).to.eql('test-item');
  });
});
