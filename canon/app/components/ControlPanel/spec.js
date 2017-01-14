import React from 'react';
import { fromJS } from 'immutable';

import { mount } from 'enzyme';

import chai, { expect } from 'chai';

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);


import { Base, bootApp, networkMiddleware } from 'tahini';
import networkHandlers from '../../network/';


// component unit test
import ControlPanel from './index.js';
import styles from './index.css';

// shallow

// test the functions binding to the selectors
// test the zippy LIs


// connected
// nothing yet... build a filter and test it?

const exampleProps = fromJS({
  devices:[
    {
      key:0, text:'blah',
      device:{items:[
	{key:0, text:'123'},
	{key:1, text:'234'},
	{key:2, text:'345'}
      ]}
    },
    {
      key:1, text:'hmm',
      device:{items:[
	{key:0, text:'456'},
	{key:1, text:'567'},
	{key:2, text:'678'}
      ]}
    },
    {
      key:2, text:'rawr',
      device:{items:[
	{key:0, text:'789'},
	{key:1, text:'890'},
	{key:2, text:'90-'}
      ]}
    }
  ]
});



describe('ControlPanel', ()=>{

  describe('shallow tests', ()=>{

    let p;

    const destroySpy = sinon.spy();
    const resetSpy = sinon.spy();
    const createSpy = sinon.spy();
    const removeSpy = sinon.spy();
    
    beforeEach(()=>{      
      p = mount( <ControlPanel subState={ControlPanel.initState}
			       destroyDevice={ destroySpy }
			       resetDevice={ resetSpy }
			       createDevice={ createSpy }
			       removeItemOnDevice={ removeSpy }
			       devices={exampleProps.get('devices')}/> );
    });

    it('that the divs for each item are displayed', ()=>{
      const listItems = p.find('.'+styles.item);

      expect(listItems).to.have.length(9);
    });

    it('zips the zippy', ()=>{
      const lis = p.find('li');
      expect(lis).to.have.length(3);

      expect(p.state().zip0).to.not.be.ok;
      expect(lis.first().childAt(1).props().style.display).to.eql('none');
      
      lis.first().childAt(0).simulate('click');

      expect(p.state().zip0).to.be.ok;
      expect(lis.first().childAt(1).props().style.display).to.not.be.ok;
    });

    
    it('removes a device', ()=>{
      // click a remove
      const itemContainer = p.find('li').first();

      const Oitems = itemContainer.find('.'+styles.item);
      
      expect(Oitems).to.have.length(3);

      expect(removeSpy.calledOnce).to.not.be.ok;

      Oitems.first().simulate('click');

      expect(removeSpy.calledOnce).to.be.ok;

    });

    it('creates a device', ()=>{
      // type a name, click create
      const inputBox = p.find('input');

      inputBox.simulate('change', {target:{value:'something'}});

      expect(createSpy.calledOnce).to.not.be.ok;
      p.find('button').at(2).simulate('click');
      expect(createSpy.calledOnce).to.be.ok;
    });

    it('destroys a device', ()=>{
      const itemContainer = p.find('li').first();

      const destroyer = itemContainer.find('.'+styles.destroy);

      expect(destroySpy.calledOnce).to.not.be.ok;
      destroyer.simulate('click');
      expect(destroySpy.calledOnce).to.be.ok;
    });

    
    it('resets a device', ()=>{
      const itemContainer = p.find('li').first();

      const resetter = itemContainer.find('.'+styles.reset);

      expect(resetSpy.calledOnce).to.not.be.ok;
      resetter.simulate('click');
      expect(resetSpy.calledOnce).to.be.ok;
    });
    // reuse the tests/selectors in dashboard fully connected
  });
  
  it('calls the api', (done)=>{
    const { getDevice, appStore } = bootApp( [networkMiddleware(networkHandlers)] );

    // perhaps to test that only 5 show

    // this stub ought to be declared in the wala
    const testValue = [
      {title:'blah'},
      {title:'yada'},
      {title:'hmm'},
      {title:'something'},
      {title:'to'},
      {title:'say'}
    ];
    global.fetch = sinon.stub().returns( Promise.resolve({
      status:200,
      json:()=>Promise.resolve(testValue)
    }) );
    
    const BoundControlPanel = getDevice(ControlPanel, [], ControlPanel.initState);
    
    const p = mount(<BoundControlPanel devices={[]}/>);
    
    const apiButton = p.find('h3 + div').first();
    
    expect(apiButton).to.be.ok;

    const uns = appStore.subscribe(()=>{
      done();
      uns();
    });
    
    apiButton.simulate('click');
  });
});
