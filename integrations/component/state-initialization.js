import { expect } from 'chai';

import { fromJS } from 'immutable';
import React from 'react';

import { mount } from 'enzyme';

import {
  Base, connectDeviceFactory, bootStores
} from '../../test-index';

describe('State initialization', ()=>{
  it('generates a widget class bound to its initial state', ()=>{

    const { getDevice } = connectDeviceFactory( bootStores() );

    const C = getDevice(Base, ['data', 'path'], Base.initState);
    const el = mount(<C/>);

    expect(el.node.selector.props.subState).to.eql(fromJS(Base.initState));
  });

  
  it('generates a widget class bound to a new initial state', ()=>{
    const testState = {test:'state'};
    const { getDevice } = connectDeviceFactory( bootStores() );
    const C = getDevice(Base, ['data', 'path'], testState);
    const el = mount(<C/>);

    expect(el.node.selector.props.subState).to.eql(fromJS(testState));
  });

  
  it('generates a widget class bound to a pre-existing initial state', ()=>{
    const { getDevice, initStateOnDataPath } =
      connectDeviceFactory( bootStores() );
    
    const dataPath = ['data', 'path'];
    const testState = {test:'state'};
    
    initStateOnDataPath(dataPath, testState);
    
    const C = getDevice(Base, dataPath);
    const el = mount(<C/>);

    expect(el.node.selector.props.subState).to.eql(fromJS(testState));
  });

  it('updates an existing state when binding a new widget', ()=>{
    const { getDevice, initStateOnDataPath } =
      connectDeviceFactory( bootStores() );

    const dataPath = ['data', 'path'];
    const testState = {test:'state'};
    const testStateUpdated = {test:'substate'};
    
    initStateOnDataPath(dataPath, testState);
    
    const C = getDevice(Base, dataPath, subState=> subState.update('test', test=> 'sub'+test));
    const el = mount(<C/>);

    expect(el.node.selector.props.subState).to.eql(fromJS(testStateUpdated));
  });
});
