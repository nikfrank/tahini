import { expect } from 'chai';

import React from 'react';

import { bootApp } from '../../test-index';

// need to test prop and children passing
// also default props setting/ getting?

describe('Using non-Base aka vanilla react components', ()=>{

  it('gets a component instance', ()=>{
    
    const { getDevice } = bootApp();

    const testProps = {test:'prop'};
    const testChildren = {test:'children'};
    
    const C = React.createElement( getDevice(React.Component), testProps, testChildren);

    expect(C.type.displayName).to.eql(`Connect(${React.Component.name})`);
    
    expect(C.props.test).to.eql(testProps.test);
    expect(C.props.children).to.eql(testChildren);
  });

  it.skip('should show up in the reflection properly', ()=>{});
});
