// test that the component, when made, gets his reducer grafted onto the global reducer hash
import { expect } from 'chai';

import React from 'react';

import { Base, bootApp } from '../../test-index';

describe('reducer initialization', ()=>{
  it('assigns the widget-reducer to the global reducerHash on its namespace', ()=>{

    const { getDevice, reducerHash } = bootApp();
    
    expect(Object.keys(reducerHash)).to.eql(['global']);

    // creating the first of a type will assign its reducer onto the global reducer hash
    const BoundBase = getDevice(Base);
    expect(Object.keys(reducerHash)).to.contain(Base.namespace);
  });


  // add a test here for reducer cleanup
});
