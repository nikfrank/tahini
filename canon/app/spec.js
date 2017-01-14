import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

import { mount, shallow } from 'enzyme';
import React from 'react';

import { bootApp } from 'tahini';

import Dashboard from 'components/Dashboard';
import TodoList from 'components/TodoList';
import SortedTodoList from 'components/SortedTodoList';

import dashboardStyles from 'components/Dashboard/index.css';
import todoStyles from 'components/TodoList/index.css';

describe('Route level widgets', ()=>{
  it('generate devices who can generate sub-devices', ()=>{
    const { getDevice } = bootApp();

    const BoundDashboard = getDevice(Dashboard, ['data', 'path'], Dashboard.initState);
    const el = mount(<BoundDashboard/>);
   
    // test that the widget has rendered its subwidgets properly

    const nzTodoLists = el.find(TodoList);
    expect(nzTodoLists).to.have.length(4);

    const nzSortedTodoLists = el.find(SortedTodoList);
    expect(nzSortedTodoLists).to.have.length(2);

    const nzCards = el.find('.'+dashboardStyles.card);
    expect(nzCards).to.have.length(4);

    const nzTodoListsByClass = el.find('.'+todoStyles.todoList);
    expect(nzTodoListsByClass).to.have.length(4);

    const nzUls = el.find('ul');
    expect(nzUls).to.have.length(5);
  });
});
