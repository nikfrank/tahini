import React, { Component } from 'react';
import { fromJS } from 'immutable';

import logo from '../logo.svg';
import './Game.css';

import Round from '../Round/';

import score from '../util/score';

class Game extends Component {
  static get actions(){
    return {
      nuGame: ()=>({
        type: 'nuGame',
      }),

      deal: ()=>({
        type: 'deal', // network getDeal(12) -> hands
      }),

      cut: (hands)=>({
        type: 'cut', // network getDeal(1, hands.flatten)
      }),

      trackScoringEvent: (e)=>({
        type: 'trackScoringEvent',
        payload: e,
      }),
    };
  }

  static get reducer(){
    return {
      nuGame: (subState, action) => subState,
      // .set whatever to new gameState
    };
  }
  
  static get initState(){
    return fromJS({
      mode: '1p-cp',
      scoring: [],
      currentHand: {}, // device
    });
  }

  componentWillMount(){
    // mount the Round Device onto currentHand
  }
  
  render() {
    return (
      <div className="Game">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React Tahini Cribbage</h2>
        </div>
        <button onClick={this.props.deal}> DEAL! </button>
        
        <Round subState={this.props.subState.get('currentHand')}/>
      </div>
    );
  }
}

export default Game;
