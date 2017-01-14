import React from 'react';
import { Base } from 'tahini';

import { fromJS } from 'immutable';

import ControlPanel from '../ControlPanel';
import TodoList from '../TodoList';
import SortedTodoList from '../SortedTodoList';

import { DashboardActions } from './actions';
import { DashboardReducer, DashboardInitState } from './reducer';

import classNames from 'classnames';
import styles from './index.css';

import { TodoListItem } from '../../pure/TodoListItem';

const races = {
  TodoList,
  SortedTodoList,
  TodoListItem
};

class Dashboard extends Base {
  static get actions(){
    return DashboardActions;
  }

  static get reducer(){
    return DashboardReducer;
  }

  static get namespace(){
    return 'tahini.canon.dashboard';
  }

  static get initState(){
    return DashboardInitState;
  }

  resetDevice(key){
    this.props.resetDevice(key, 'todoList', races[
      this.props.subState.getIn(['devices', key, 'race'])
    ].initState);
  }

  activateDevice(key){
    this.props.activateDevice(key);
  }

  destroyDevice(key){
    this.props.destroyDevice(key);
    delete this.devices[key];
  }
  createDevice(text, race){
    this.props.createDevice(text, race);
  }
  
  rectifyDeviceState(props){    
    const devices = props.subState.get('devices');
    this.devices = this.devices || {};

    [...devices.keys()].forEach((key)=> {

      // if the device is the same, don't rerender it
      // this only checks if the class has changed. no more, no less
      
      if((props.subState.getIn(['devices', key, 'race']) ===
	this.props.subState.getIn(['devices', key, 'race'])) &&
	 (this.devices[key])) return;

      
      // new device, or class has changed, so get an instance
      
      const cl = races[devices.getIn([key, 'race'])];

      
      this.devices[key] = React.createElement(props.getDevice(
	cl, ['devices', key, 'todoList'], cl.initState
      ), {
	  itemClass: races[devices.getIn([key, 'listItemRace'])],
	  stateIndex: key,
	  destroySelf: this.destroyDevice.bind(this, key),
	  exposures:{}
	})
    });
  }

  componentWillReceiveProps(props){
    const getRaceList = s=> s.mapEntries( ([k,v])=> [k,v.get('race')]);

    if(!getRaceList(props.subState.get('devices'))
      .equals(
	getRaceList(this.props.subState.get('devices')) )) this.rectifyDeviceState(props);
  }

  componentWillMount(){
    this.rectifyDeviceState(this.props);

    // do something with this? or use it in control panel to populate self?
    this.unsubFromReflection = this.props.subscribeToReflectionStore(h=> 0);
    
    this.controlPanel =
      this.props.getDevice( ControlPanel, ['control-panel'], ControlPanel.initState );
  }

  componentDidMount(){
    // by now we have the exposures from children devices
    // could use the fact to pass a "sibling ready state" to the control panel
    //    console.log(this.devices.hash0.props.exposures);
  }

  componentWillUnmount(){
    this.props.abdicate();
  }
  
  mapTodoListForPanel(tlState){
    return tlState
      .mapKeys(k=> (k === 'todoList')? 'device':k)
      .updateIn(['device'], fromJS({}), w=> w.mapKeys(k=> (k === 'todos')? 'items':k));
  }

  
  render() {
    const devices = this.props.subState.get('devices').toObject(); // ordered?
    
    return (
      <div>
	<this.controlPanel destroyDevice={this.destroyDevice.bind(this)}
			   resetDevice={this.resetDevice.bind(this)}
			   createDevice={this.createDevice.bind(this)}
			   removeItemOnDevice={(wkey, ikey)=>
					      this.devices[wkey].props.exposures.removeTodo(ikey)}
			   devices={
			     this.props.subState.get('devices').mapEntries(([k,v])=>
			       [k, this.mapTodoListForPanel(v)] ) } />
	
	{Object.keys(devices).sort().map((key)=>
	  <div key={key}
	       className={classNames(styles.card, {[styles.active]:devices[key].get('active')})}
	       onClick={this.activateDevice.bind(this, key)}>
	    {devices[key].get('text')} - <b>{devices[key].get('race')}</b>
	    {this.devices[key]}
	    <button className={styles.reset}
		    onClick={this.resetDevice.bind(this, key)}>Reset device!</button>
	  </div>
	 )}
      </div>
    );
  }
}
export default Dashboard;
