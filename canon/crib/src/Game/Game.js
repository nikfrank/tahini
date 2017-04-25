import React, { Component } from 'react';
import { fromJS } from 'immutable';

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
        network: {
          handler: 'GetDeal',
          payload: { size: 12 },
          nextAction: {
            type: 'dealHands',
          },
        }
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

      dealHands: (subState, { payload: cards }) =>
        subState
          .setIn( ['currentHand', 'hands', 0], fromJS( cards.slice(0, 6) ) )
          .setIn( ['currentHand', 'hands', 1], fromJS( cards.slice(6) ) ),
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
          <h2>Welcome to React Tahini Cribbage</h2>
        </div>
        <button onClick={this.props.deal}> DEAL! </button>
        
        <Round subState={this.props.subState.get('currentHand')}/>
      </div>
    );
  }
}

export default Game;
