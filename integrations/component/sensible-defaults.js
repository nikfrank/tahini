import { expect } from 'chai';

import React, { Component } from 'react';

import { connectDeviceFactory, bootStores } from '../../test-index';

// need to test prop and children passing
// also default props setting/ getting?

describe('Using non-Base aka vanilla react components', ()=>{

  it('gets a component instance', ()=>{
    
    const { getDevice } = connectDeviceFactory( bootStores() );

    const testProps = {test:'prop'};
    const testChildren = {test:'children'};
    
    const CDevice = getDevice(Component);

    const C = (<CDevice {...testProps}>{testChildren}</CDevice>);
    
    expect(C.type.displayName).to.eql(`Connect(${Component.name})`);
    
    expect(C.props.test).to.eql(testProps.test);
    expect(C.props.children).to.eql(testChildren);
  });

  it.skip('should show up in the reflection properly', ()=>{});
});
