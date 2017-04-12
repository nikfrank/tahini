import React from 'react';
import { Base } from 'tahini';

import styles from './index.css';

import { actions } from './actions';
import { reducer, initState } from './reducer';

class ControlPanel extends Base {
  static get actions(){
    return actions;
  }
  
  static get reducer(){
    return reducer;
  }
  
  static get namespace(){
    return 'tahini.canon.ControlPanel';
  }
  
  static get initState(){
    return initState;
  }

  componentWillMount(){
    this.state = {nuDeviceName:''};
  }
  
  componentWillReceiveProps(){
    //console.log(this.props);
  }
  
  nuNameChange(e){
    this.setState({nuDeviceName:e.target.value});
  }

  zip(key){
    this.setState({['zip'+key]: !this.state['zip'+key]});
  }

  addDevice(){
    this.props.createDevice(this.state.nuDeviceName, 'TodoList')
    this.setState({nuDeviceName:''});
  }

  triggerAddDevice(){
    const actionName = 'createDevice';

    const parentH = this.props.queryReflection({relPath:['..']});
    
    const dashNamespace = parentH.keys().next().value;
    const dashActions = parentH.getIn( [ dashNamespace, 'actions' ] );

    if( dashActions.contains( actionName ) ){
    
      this.props.triggerActionOnDevice(['..'], dashNamespace, actionName, [
        this.state.nuDeviceName, 'TodoList'
      ]);
      this.setState({nuDeviceName:''});

    } else {
      // idk, trigger a warning?
    }
  }
  
  componentDidMount(){

  }
  
  render(){
    // plus button, centred
    // array of
    //   dropDown(type), icon buttons
    
    return (
      <div className={styles.controlPanel}>
	<h3>Control Panel Device</h3>
	<div onClick={this.props.getItemsFromAPI}>Get from API</div>
	{
          this.props.subState.get('list', []).map((item, i)=>
            (i<5)? <div key={item}> {item} </div>:''
	  )
        }
        <button onClick={this.props.subscribeItemStream}>subscribe</button>
        <button onClick={this.props.unsubscribeItemStream}>unsubscribe</button>
        <div>{ this.props.subState.get('lastUnsubscribe', 0) }</div>
	<label>
	  <div>New device name</div>
	  <input value={this.state.nuDeviceName} onChange={this.nuNameChange.bind(this)}/>
	</label>
	<button onClick={this.addDevice.bind(this)}>
	  Create!
	</button>
	<button onClick={this.triggerAddDevice.bind(this)}>
	  Trigger Creation!
	</button>
	<ul>
	  {[...this.props.devices.keys()].sort().map(key=>
	    <li key={key}>
	      <div onClick={()=> this.zip(key)}>
		{this.props.devices.getIn([key, 'text'])}
	      </div>

	      <div style={this.state['zip'+key]? {}:{display:'none'}}>
		{(this.props.devices.getIn([key, 'device', 'items'])||[]).map(item=>
		  <div key={item.get('key')} className={styles.item}
		       onClick={()=>this.props.removeItemOnDevice(key, item.get('key'))}>
		    {item.get('text')}
		  </div>
		 )}
		  <div className={styles.circleButtons}>
		    <div onClick={()=> this.props.resetDevice(key)}
			 className={styles.reset}>
		      reset
		    </div>
		    <div onClick={()=> this.props.destroyDevice(key)}
			 className={styles.destroy}>
		      destroy
		    </div>
		  </div>
	      </div>
	    </li>
	   )}
	</ul>
      </div>
    );
  }
}
export default ControlPanel;
