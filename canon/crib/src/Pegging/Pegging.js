import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import score from '../util/score';

class Pegging extends Component {
  static get actions(){
    return {
      next: ()=>({
        type: 'next',
      }),

    };
  }

  static get reducer(){
    return {
      next: (subState, action) =>
        subState,
    };
  }
  
  static get initState(){
    return fromJS({
      hands: [
        [],
        [],
      ],
      cribOwner: 0,
      pegging: [],
    });
  }

  componentWillMount(){
    // move prop hands into substate
  }

  componentWillReceiveProps(nuProps){
    // check for made score, this.props.onScoringEvent
    // check if all cards are out, notify?
  }
    
  render() {
    return (
      <div className="Pegging">
        <Hand cards={this.props.subState.getIn( ['hands', 0] )}
              hidden={ !this.props.subState.getIn( ['cut', 'rank'] )}
              onClick={ci => this.props.selectCard(0, ci)}/>
        
        <Hand cards={this.props.subState.getIn( ['hands', 1] )}
              onClick={ci => this.props.selectCard(1, ci)}/>
        
      </div>
    );
  }
}

export default Pegging;
