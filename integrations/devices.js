import React from 'react';
import ReactDOM from 'react-dom';
import {createStore/*, applyMiddleware*/} from 'redux';

import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);


import { fromJS } from 'immutable';

import {
  consumeActionByNamespace,
  applyPartialAction,
  isolateReducerWithDataPath,
  
  bootApp,
  baseReducerHash,
  Base
} from '../';


describe('test sandlot', ()=>{


  // use the Base widget to test:
  // reducer initialization 

  // use the canonical TodoList widget to test:
  // action isolation (decoration)

  
  // improve the Item component to test:
  // pure components as a unit

  // give him the ability to "set/unset as done"

  
  describe('get component instance', ()=>{


    // use the canonical Dashboard widget to test:
    // component mounting
    // dynamic component mounting


    // write a wrapping "categorical TodoList" to pass categories to items
    // use the canonical TodoList widget to test:
    // mounting pure components
    // dynamically mounting pure components
    // binding parent data and action creators to the pure components

    // use the canonical Dashboard widget (with a new widget) to test:
    // sibling and cousin widget communication

    // the new widget should be a control panel for the other widgets
    // give it a binding for filter lists, add item to all


    // using the Control Panel widget, demonstrate and test:
    // set/unset "protect by regex"
    
    

    // write some problem cases:
    // namespace overrides
    
    
    it('generates a component class and a sub-component', ()=>{
      // GCI -> class. createElement, call its props.actions?

      // declare a class with action, reducer, initState, namespace
      // that GCIs a Base.

      // GCI one,
      // test its children = [Base],
      // call its action
      // (check that the actionC was called withe right params,
      //  check that the reducer was called withe right params,
      //  check that the state has mutated the correct way)
      
    });
  });
});
