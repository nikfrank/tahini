import React, { Component } from 'react';
import { fromJS } from 'immutable';

import './Round.css';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import score from '../util/score';

class Round extends Component {
  static get actions(){
    return {
      deal: ()=>({
        type: 'noop',
      }),
    };
  }

  static get reducer(){
    return {
      noop: (subState, action) => subState,
    };
  }
  
  static get initState(){
    return fromJS({
      index: 0,
      hands: [
        [
          { rank: 1, suit: 0 },
          { rank: 2, suit: 1 },
          { rank: 3, suit: 2 },
          { rank: 3, suit: 3 },
          { rank: 4, suit: 1 },
          { rank: 5, suit: 2 },
        ],

        [
          { rank: 10, suit: 0 },
          { rank: 10, suit: 1 },
          { rank: 11, suit: 0 },
          { rank: 11, suit: 1 },
          { rank: 12, suit: 0 },
          { rank: 12, suit: 1 },
        ],
      ],
      crib: [],
      cribOwner: 0,
      pegging: [],
      cut: {},
    });
  }
  
  render() {
    return (
      <div className="Round">
        <p>p1</p>
        <Hand cards={this.props.subState.getIn( ['hands', 0] )} />
        <p>p2</p>
        <Hand cards={this.props.subState.getIn( ['hands', 1] )} />
        <p>crib</p>
        <Hand cards={this.props.subState.get('crib')} />
        <p>cut</p>
        <Card card={this.props.subState.get('cut')}/>
      </div>
    );
  }
}

export default Round;
