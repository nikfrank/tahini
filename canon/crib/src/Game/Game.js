import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Round from '../Round/';
import Scoreboard from '../pure/Scoreboard';

import score from '../util/score';

class Game extends Component {
  static get namespace(){
    return 'crib-Game';
  }
  
  static get actions(){
    return {
      trackScoringEvent: (e)=>({
        type: 'trackScoringEvent',
        payload: e,
      }),

      nuGame: ()=>({ type: 'nuGame' }),
    };
  }

  static get reducer(){
    return {
      // if one player has >120, set game to HEwon, don't change score further
      
      trackScoringEvent: (subState, { payload: e }) => {
        const nuScores = subState
          .update('scoring', sc => sc.push(fromJS(e)) )
          .updateIn(['scores', e.player], sc => sc + e.pts);
        
        return ((
          subState.getIn(['scores', 0]) > 120
        ) || (
          subState.getIn(['scores', 1]) > 120
        )) ? subState  : (
          nuScores.getIn(['scores', 0]) > 120 ? nuScores.set('winner', 0) :
          nuScores.getIn(['scores', 1]) > 120 ? nuScores.set('winner', 1) :
          nuScores
        )
      },

      nuGame: state=> state.set('scoring', fromJS([]))
                           .set('winner', -1)
                           .set('scores', fromJS([0,0]))

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
                       winner={this.props.subState.get('winner')}
                       nuGame={this.props.nuGame}
                       scores={this.props.subState.get('scores')}
                       scoring={this.props.subState.get('scoring')}/>
        </div>

      </div>
    );
  }
}

export default Game;
