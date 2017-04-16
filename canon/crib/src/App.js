import React, { Component } from 'react';
import { fromJS } from 'immutable';

import logo from './logo.svg';
import './App.css';

import Hand from './Hand/';

class App extends Component {
  static get actions(){
    return {
      deal: ()=>({
        type: 'deal',
      }),
    };
  }

  static get reducer(){
    return {
      // make a random hand from nu
      // and score it
      deal: (subState, action) => subState.set('score', 20),
    };
  }
  
  static get initState(){
    return fromJS({
      test: 'state',
      cards: [ '10_heart', '10_club', '8_diamond', '9_heart', '7_spade'],
      score: 12,
    });
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React Tahini Cribbage</h2>
        </div>
        <button onClick={this.props.deal}> DEAL! </button>
        <Hand cards={this.props.subState.get('cards')}
              score={this.props.subState.get('score')}/>
      </div>
    );
  }
}

export default App;
