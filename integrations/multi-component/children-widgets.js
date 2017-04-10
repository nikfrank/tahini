import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

import { fromJS } from 'immutable';

import React from 'react';
import { mount } from 'enzyme';

import {
  Base, connectDeviceFactory, bootStores
} from '../../test-index';


describe('child widget', ()=>{
  it('generates a widget who can generate sub-widgets', ()=>{
    const { getDevice, initStateOnDataPath } =
      connectDeviceFactory( bootStores() );

    const dataPath = ['data', 'path'];
    
    initStateOnDataPath(dataPath, Base.initState);
    
    const BoundBase = getDevice(Base, dataPath);
    const el = mount(<BoundBase/>);
    
    expect(el.node.selector.props.subState).to.eql(fromJS(Base.initState));


    // use a Dashboard

    // make a control center widget

    // give him access to all the widget data
    // test that he displays it properly

    // test that he is able to use the Dashboard actions given to him



    // then think of a way to juggle that into a global test
    
  });
});
