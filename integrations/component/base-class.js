import { expect } from 'chai';

import React from 'react';

import { Base, bootApp } from '../../test-index';

// need to test prop and children passing
// also default props setting/ getting?

describe('Base class', ()=>{

  it('gets a component instance', ()=>{
    
    const { getDevice, appStore, reducerHash,
            initStateOnDataPath, updateStateOnDataPath } = bootApp();

    const testProps = {test:'prop'};
    const testChildren = {test:'children'};
    
    const C = React.createElement( getDevice(Base, ['data', 'path']),
				   testProps, testChildren);

    expect(C.type.displayName).to.eql('Connect(Base)');
    
    expect(C.props.test).to.eql(testProps.test);
    expect(C.props.children).to.eql(testChildren);


    Base.defaultProps.blah = 'hmm';
    
    expect(Base.defaultProps.getDevice() === Base).to.be.ok;
    expect(JSON.stringify(Base.defaultProps.exposures) === '{}').to.be.ok;

    expect(Base.defaultProps.blah).to.eql('hmm');

    Base.defaultProps = {};

    expect(Base.defaultProps.blah).to.not.eql('hmm');
  });
});
