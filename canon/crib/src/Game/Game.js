import React, { Component } from 'react';
import { fromJS } from 'immutable';

import './Game.css';

import Round from '../Round/';
import Scoreboard from '../pure/Scoreboard';

import score from '../util/score';

class Game extends Component {
  static get namespace(){
    return 'crib-Game';
  }
  
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

      // if one player has >120, set game to HEwon, don't change score further
      
      trackScoringEvent: (subState, { payload: e }) =>
        (
          subState.getIn(['scores', 0]) > 120
        ) ? subState.set('winner', 0) : (
          
          subState.getIn(['scores', 1]) > 120
        ) ? subState.set('winner', 1) : (

          // update winer automatically (this waits til next scoring event)
          subState
            .update('scoring', sc => sc.push(fromJS(e)) )
            .updateIn(['scores', e.player], sc => sc + e.pts) ),
    };
  }
  
  static get initState(){
    return fromJS({
      mode: '1p-cp',
      scoring: [],
      winner: -1,
      scores: [0, 0],
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
        <Scoreboard scoring={this.props.subState.get('scoring')}/>
        {
          (this.props.subState.get('winner') > -1) ?
          ['computer', 'p1'][this.props.subState.get('winner')]+' won' : ''
        }
        <div style={{position:'relative'}}>
          <CurrentHand onScoringEvent={this.props.trackScoringEvent}
                       scoring={this.props.subState.get('scoring')}/>
        </div>

      </div>
    );
  }
}

export default Game;
