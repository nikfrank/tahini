import React from 'react';
import { fromJS } from 'immutable';

import { mount } from 'enzyme';

import chai, { expect } from 'chai';

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);


import Dashboard from './index.js';
import styles from './index.css';

import ControlPanel from '../ControlPanel';
import controlPanelStyles from '../ControlPanel/index.css';

import TodoList from '../TodoList';
import SortedTodoList from '../SortedTodoList';
import todoListStyles from '../TodoList/index.css';

import { Base, bootApp } from 'tahini';

describe('Dashboard', ()=>{

  describe('shallow tests', ()=>{
    
    it('renders the devices', ()=>{
      const initActive = Dashboard.initState.get('devices').findKey(w=> w.get('active'));

      const spyOnActivate = sinon.spy(), hierSubSpy = sinon.spy();

      // turn this into a spy, and test that it runs the number of devices times
      const fakeGWC = ()=>Base;
      
      const p = mount(
	<Dashboard subState={Dashboard.initState}
		   activateDevice={spyOnActivate}
		   getDevice={fakeGWC}
                   subscribeToReflectionStore={hierSubSpy}/>
      );

      // check that the devices have rendered
      const renderedDevices = p.find('.'+styles.card);
      expect(renderedDevices)
	.to
	.have.length(Dashboard.initState.get('devices').size);

      // check that the correct device is active
      const activeDevice = p.find('.'+styles.card+'.'+styles.active).first();
      expect(activeDevice.text())
	.to
	.contain(Dashboard.initState.getIn(['devices', initActive, 'text']));


      // check that the spy wasn't called
      expect(spyOnActivate.called).to.not.be.ok;

      // simulate a click and check that the spy is called
      renderedDevices.first().simulate('click');

      // check that it called the spy
      expect(spyOnActivate.calledOnce).to.be.ok;    
    });
  });


  describe('connected tests', ()=>{
    
    let p, getDevice, appStore, BoundDashboard;

    const dataPath = [];
    
    beforeEach(()=>{
      ({ getDevice, appStore } = bootApp());
      BoundDashboard = getDevice(Dashboard, dataPath, Dashboard.initState);
      
      p = mount(<BoundDashboard/>);
    });

    it('can reset a TodoList child device', (done)=>{      
      const device = p.find('.'+styles.card)
		      .filterWhere(w=> w.find(SortedTodoList).length)
		      .last();

      const wkey = device.key();

      const inputBox = device.find('input');

      inputBox.simulate('change', { target: { value:'test-todo'} } );


      expect(appStore.getState().getIn(['devices', wkey,'todoList','todos']).size)
	.to
	.eql( TodoList.initState.get('todos').size );

      
      // flow is backwards for async ops below
      // which I really REALLY don't like. srsly.
      const next = ()=>{
	const uns = appStore.subscribe(()=>{
	  expect(appStore.getState().getIn(['devices', wkey,'todoList','todos']).size)
	    .to
	    .eql( TodoList.initState.get('todos').size ); // can also test the text
	  
	  uns();
	  done();
	});

	const resetButton = device.find('button.'+styles.reset).first();
	resetButton.simulate('click');
      };

      
      
      const uns = appStore.subscribe(()=>{
	expect(appStore.getState().getIn(['devices', wkey,'todoList','todos']).size)
	  .to
	  .eql( TodoList.initState.get('todos').size + 1 );
	
	uns();
	next();
      });
      
      const addButton = device.find('button.'+todoListStyles.add);
      addButton.simulate('click');

      // could refactor this as a list of functions currentState=>{}
      // each of which is run after index reduxState changes

      // better than that, the whole thing could be a middleware
      // I want to run expectations after some of a series of actions

      // or like done here, subscribe(-> check, unsub); act()
    });

    
    it('can reset a SortedTodoList child device', (done)=>{
      const device = p.find('.'+styles.card)
			  .filterWhere(w=> w.find(SortedTodoList).length)
			  .last();

      const wkey = device.key();
      
      const inputBox = device.find('input');

      inputBox.simulate('change', { target: { value:'test-todo'} } );


      expect(appStore.getState().getIn(['devices', wkey,'todoList','todos']).size)
	.to
	.eql( SortedTodoList.initState.get('todos').size );

      
      const next = ()=>{
	const uns = appStore.subscribe(()=>{
	  expect(appStore.getState().getIn(['devices', wkey,'todoList','todos']).size)
	    .to
	    .eql( SortedTodoList.initState.get('todos').size ); // can also test the text
	  
	  uns();
	  done();
	});

	const resetButton = device.find('button.'+styles.reset).first();
	resetButton.simulate('click');
      };

      
      
      const uns = appStore.subscribe(()=>{
	expect(appStore.getState().getIn(['devices', wkey,'todoList','todos']).size)
	  .to
	  .eql( SortedTodoList.initState.get('todos').size + 1 );
	
	uns();
	next();
      });
      
      const addButton = device.find('button.'+todoListStyles.add);
      addButton.simulate('click');
    });



    it('destroys a child device', (done)=>{

      expect(appStore.getState().get('devices').size)
	.to
	.eql( Dashboard.initState.get('devices').size );
      
      const destroyButton = p.find(TodoList).first().find('.'+todoListStyles.destroy);
      
      const uns = appStore.subscribe(()=>{
	expect(appStore.getState().get('devices').size)
	  .to
	  .eql( Dashboard.initState.get('devices').size - 1);
	uns();
	done();
      });
      
      destroyButton.simulate('click');
    });


    it('creates a child device from the control panel', (done)=>{
      expect(appStore.getState().get('devices').size)
	.to
	.eql( Dashboard.initState.get('devices').size );

      const cp = p.find(ControlPanel);

      const nuDeviceNameInput = cp.find('input').first();
      const nuName = 'whatever';
      
      nuDeviceNameInput.simulate('change', {target:{value:nuName}});

      const nuDeviceButton = cp.find('button').at(2);


      const uns = appStore.subscribe(()=>{
	expect(appStore.getState().get('devices').size)
	  .to
	  .eql( Dashboard.initState.get('devices').size + 1);
	uns();
	done();
      });
      
      
      nuDeviceButton.simulate('click');
      
      // this here should use the control panel's page object to select things from it!
    });


    it('removes a todo list item from the control panel', (done)=>{
      const cp = p.find(ControlPanel);
      
      const removeItemButton = cp.find('div.'+controlPanelStyles.item).first();

      const oldSize = appStore.getState().getIn(['devices', 'hash0', 'todoList', 'todos']).size;
      
      const uns = appStore.subscribe(()=>{
	expect(appStore.getState().getIn(['devices', 'hash0', 'todoList', 'todos']).size)
	  .to
	  .eql( oldSize - 1);
	uns();
	done();
      });
      
      
      removeItemButton.simulate('click');
      
    });
  });
});


describe('Dashboard reducer', ()=>{

  it('sets the active device', ()=>{
    const iS = fromJS({
      devices:[
	{ text:'blah', key:0 },
	{ text:'hmm', key:1, active:true }
      ]
    });

    const xS = fromJS({
      devices:[
	{ text:'blah', key:0, active:true },
	{ text:'hmm', key:1 }
      ]
    });
    
    const action = Dashboard.actions.activateDevice(0);
    
    const nS = Dashboard.reducer[action.type](iS, action);
    expect(nS).to.eql(xS);
  });

  
  it('does nothing on setting already active to active', ()=>{
    const iS = fromJS({
      devices:[
	{ text:'blah', key:0 },
	{ text:'hmm', key:1, active:true }
      ]
    });

    const action = Dashboard.actions.activateDevice(1);

    const nS = Dashboard.reducer[action.type](iS, action);
    expect(nS === iS).to.eql(true);
    // use === to assert mutation and hence render has been avoided
  });

  it('does nothing on setting nonexistant device to active', ()=>{
    const iS = fromJS({
      devices:[
	{ text:'blah', key:0 },
	{ text:'hmm', key:1 }
      ]
    });

    const action = Dashboard.actions.activateDevice(1337);

    const nS = Dashboard.reducer[action.type](iS, action);
    expect(nS === iS).to.eql(true);
  });
});
