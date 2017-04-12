import React from 'react';
import { fromJS } from 'immutable';
import { expect } from 'chai';

import { mount } from 'enzyme';

import SortedTodoList from './index.js';
import styles from './index.css';
import todoListStyles from '../TodoList/index.css';

import {
  bootStores,
  connectDeviceFactory,
} from 'tahini';

describe('SortedTodoList', ()=>{

  describe('shallow tests', ()=>{

    let p;

    beforeEach(()=>{
      p = mount( <SortedTodoList subState={SortedTodoList.initState} /> );
    });
    
    it('renders the SortedTodoList', ()=>{

      // here should actually check the sort?!
      expect(p.html()).to.contain('Sorted');

      const todos = p.find('li');

      expect(todos).to.have.length(SortedTodoList.initState.get('todos').size);
    });
  });


  describe('connected tests', ()=>{

    let p, getDevice, appStore, BoundSortedTodoList;

    const dataPath = [];
    
    beforeEach(()=>{
      const stores = bootStores();
      ({ getDevice } = connectDeviceFactory( stores ));
      ({ appStore } = stores);
      
      BoundSortedTodoList = getDevice(SortedTodoList, dataPath, SortedTodoList.initState);

      p = mount(<BoundSortedTodoList/>);
    });
    
    
    it('toggles the sort direction', (done)=>{
      const toggleButton = p.find('button.'+styles.toggle);
      expect(toggleButton).to.have.length(1);

      const origOrder = appStore.getState().getIn(dataPath.concat('todos'));
      
      const uns = appStore.subscribe(()=>{
	const nextOrder = appStore.getState().getIn(dataPath.concat('todos'));
	
	expect(origOrder.reverse()).to.eql(nextOrder);
	uns();
	done();
      });
      
      toggleButton.simulate('click');      
    });
    

    it('adds a todo', (done)=>{
      const inputBox = p.find('input');
      const testTodoText = 'test-todo';

      // type testTodoText
      inputBox.simulate('change', { target: { value: testTodoText } } );

      // handle async setState
      p.instance().setState({}, ()=>{
	const addButton = p.find('button.'+todoListStyles.add);
	const origTodos = appStore.getState().getIn(dataPath.concat('todos'));

	const uns = appStore.subscribe(()=>{
	  const nextTodos = appStore.getState().getIn(dataPath.concat('todos'));

	  expect(origTodos.push(fromJS({key:3, text:testTodoText})))
	    .to
	    .eql(nextTodos);
	  
	  uns();
	  done();
	});

	addButton.simulate('click');
      });
    });
    
    
    it('resorts the list then adds a todo then sorts back', (done)=>{
      // this is conceptually a "stress test" :D
      
      const toggleButton = p.find('button.'+styles.toggle);
      const inputBox = p.find('input');
      const addButton = p.find('button.'+todoListStyles.add);

      const testTodoText = 'test-todo';
      
      const origOrder = appStore.getState().getIn(dataPath.concat('todos'));


      const lastStep = ()=>{
	const uns = appStore.subscribe(()=>{
	  const lastOrder = appStore.getState().getIn(dataPath.concat('todos'));
	  
	  expect(origOrder.push(fromJS({key:3, text:testTodoText}))
			  .sortBy(a=> a.get('text')))
	    .to
	    .eql(lastOrder);
	  
	  uns();
	  done();
	});
	
	toggleButton.simulate('click');
      };


      
      const nextStep = ()=>{
	inputBox.simulate('change', { target: { value: testTodoText } } );

	// this deals with the async setState
	p.instance().setState({}, ()=>{  
	  const origTodos = appStore.getState().getIn(dataPath.concat('todos'));

	  const uns = appStore.subscribe(()=>{
	    const nextTodos = appStore.getState().getIn(dataPath.concat('todos'));

	    expect(origTodos.push(fromJS({key:3, text:testTodoText})))
	      .to
	      .eql(nextTodos);
	    
	    uns();
	    lastStep();
	  });

	  addButton.simulate('click');
	});
      };

      
      const uns = appStore.subscribe(()=>{
	const nextOrder = appStore.getState().getIn(dataPath.concat('todos'));
	
	expect(origOrder.reverse()).to.eql(nextOrder);
	uns();
	nextStep();
      });
      
      toggleButton.simulate('click');
      
    });
  });
});


describe('SortedTodoList reducer', ()=>{

  it('sets the state', ()=>{
    const iS = fromJS(SortedTodoList.initState);

    const xS = SortedTodoList.initState.merge({ direction:'asc' });
    
    const action = SortedTodoList.actions.setDirection( 'asc' );
    
    const nS = SortedTodoList.reducer[action.type](iS, action);
    expect(nS).to.eql(xS);
  });
});
