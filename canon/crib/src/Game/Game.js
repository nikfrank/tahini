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

    };
  }
  
  static get initState(){
    return fromJS({
      mode: '1p-cp',
      scoring: [],
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
          </h2>
        </div>
        
        <CurrentHand onScoringEvent={this.props.trackScoringEvent}
                     scoring={this.props.subState.get('scoring')}/>
      </div>
    );
  }
}

export default Game;
