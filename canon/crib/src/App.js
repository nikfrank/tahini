import React, { Component } from 'react';
import { fromJS } from 'immutable';

import logo from './logo.svg';
import './App.css';

import Hand from './Hand/';

import score from './util/score';

class App extends Component {
  static get actions(){
    return {
      deal: ()=>({
        network: {
          handler: 'GetDeal',
          payload: { size: 5, burned: [] },
          nextAction: { type: 'deal' },
        },
      }),
    };
  }

  static get reducer(){
    return {
      // make a random hand from nu
      // and score it
      deal: (subState, { payload: cards }) => subState
        .set('score', score(cards.slice(0, 4), cards.slice(4)) )
        .set('cards', fromJS(cards)),
    };
  }
  
  static get initState(){
    return fromJS({
      test: 'state',
      cards: [],
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
