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

      trackScoringEvent: (subState, { payload: e }) =>
        subState.update('scoring', sc => sc.push(e) ),
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

        <p>
          my pts:
          {
            this.props.subState.get('scoring').toJS()
                .filter(se => se.player === 1)
                .reduce((p, c)=> (p + c.pts), 0)
          }
          {'   '}
          cp pts:
          {
            this.props.subState.get('scoring').toJS()
                .filter(se => se.player === 0)
                .reduce((p, c)=> (p + c.pts), 0)
          }
        </p>

        <div style={{position:'relative'}}>
          <CurrentHand onScoringEvent={this.props.trackScoringEvent}
                       scoring={this.props.subState.get('scoring')}/>
        </div>

      </div>
    );
  }
}

export default Game;
