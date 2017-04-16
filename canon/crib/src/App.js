import React, { Component } from 'react';
import { fromJS } from 'immutable';

import logo from './logo.svg';
import './App.css';

import Hand from './Hand/';

class App extends Component {
  static get initState(){
    return fromJS({
      test: 'state'
    });
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {this.props.subState.get('test')}
        </p>
        <Hand/>
      </div>
    );
  }
}

export default App;
