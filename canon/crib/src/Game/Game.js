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

      trackScoringEvent: (e)=>({
        type: 'trackScoringEvent',
        payload: e,
      }),

      nextHand: ()=>({
        type: 'nextHand',
      }),
    };
  }

  static get reducer(){
    return {
      nuGame: (subState, action) => subState,
      // .set whatever to new gameState

      nextHand: (subState, action) => subState.update('handIndex', i => i+1),
    };
  }
  
  static get initState(){
    return fromJS({
      mode: '1p-cp',
      scoring: [],
      handIndex: 0,
    });
  }

  componentWillMount(){
    // mount the Round Device onto currentHand
    this.CurrentHand = this.props.getDevice(Round, ['currentHand'],
                                            Round.initState);
  }
  
  render() {
    const { CurrentHand } = this;
    
    return (
      <div className="Game">
        <div className="App-header">
          <h2>
            Welcome to React Tahini Cribbage
            <button onClick={this.props.nextHand}>NEXT</button>
          </h2>
        </div>
        
        <CurrentHand key={this.props.subState.get('handIndex')}
                     scoring={this.props.subState.get('scoring')}/>
      </div>
    );
  }
}

export default Game;
