import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { fromJS } from 'immutable';

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
      </div>
    );
  }
}

export default App;
