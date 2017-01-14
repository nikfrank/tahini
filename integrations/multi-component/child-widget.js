import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { fromJS } from 'immutable';

import React from 'react';
import { mount } from 'enzyme';

import { bootApp } from '../../test-index';

import Dashboard from '../../canon/app/components/Dashboard';
import TodoList from '../../canon/app/components/TodoList';
import todoListStyles from '../../canon/app/components/TodoList/index.css';

import SortedTodoList from '../../canon/app/components/SortedTodoList';

describe('child device', ()=>{
  it('generates a device who can generate sub-devices', (done)=>{
    const { getDevice, initStateOnDataPath, appStore } = bootApp();

    const dataPath = ['data', 'path'];
    
    const BoundDashboard = getDevice(Dashboard, dataPath, Dashboard.initState);

    const gdSpy = sinon.spy();

    const oGd = BoundDashboard.defaultProps.getDevice;
    
    BoundDashboard.defaultProps.getDevice = (...args)=>{
      gdSpy(...args);
      return oGd(...args);
    };
    
    const p = mount(<BoundDashboard/>);

    // this due to the child devices initing their state under the parent's
    expect(p.node.mergedProps.subState).to.not.eql(fromJS(Dashboard.initState));

    // +1 for control panel
    expect(gdSpy.callCount).to.eql(Dashboard.initState.get('devices').size +1);


    // expect that none of the children are mounted to the dashboard root
    [...Array(gdSpy.callCount).keys()].forEach(i=>{
      expect( gdSpy.getCall(i).args[1].length > 0 ).to.be.ok;
      expect( gdSpy.getCall(i).args[1].constructor ).to.eql(Array);
    });

    
    // test that the child gets the parent data

    const todoLists = p.find(TodoList);
    expect(todoLists).to.have.length( Dashboard.initState.get('devices').size );

    const sortedTodoLists = p.find(SortedTodoList);
    expect(sortedTodoLists).to.have.length( Dashboard.initState.get('devices').size / 2 );

    const todoItems = todoLists.first().find('li');
    expect(todoItems).to.have.length( gdSpy.firstCall.args[0].initState.get('todos').size );

    // this stateIndex should be a convention for testability?
    const firstDeviceTodos = appStore.getState().getIn(
      dataPath.concat(['devices', todoLists.first().props().stateIndex, 'todoList', 'todos'])
    );
    expect(todoItems).to.have.length(firstDeviceTodos.size);
    
    // pass a suicide destroyDevice action from Dashboard to device
    // test that child can call parent action passed to him

    expect(appStore.getState().getIn(dataPath.concat(['devices'])).size)
      .to
      .eql( Dashboard.initState.get('devices').size );
    
    const destroyButton = p.find(TodoList).first().find('.'+todoListStyles.destroy);
    
    const uns = appStore.subscribe(()=>{
      expect(appStore.getState().getIn(dataPath.concat(['devices'])).size)
	.to
	.eql( Dashboard.initState.get('devices').size - 1);
      uns();
      done();
    });
    
    destroyButton.simulate('click');
    
  });
});
