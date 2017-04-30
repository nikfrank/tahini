import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import score from '../util/score';

class Round extends Component {
  static get actions(){
    return {
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

      selectCard: (handIndex, cardIndex) => ({
        type: 'selectCard',
        payload: [handIndex, cardIndex],
      }),
    };
  }

  static get reducer(){
    return {
      dealHands: (subState, { payload: cards }) =>
        subState
          .setIn( ['hands', 0], fromJS( cards.slice(0, 6) ) )
          .setIn( ['hands', 1], fromJS( cards.slice(6) ) ),

      selectCard: (subState, { payload: [hi, ci] }) =>
        subState
          .updateIn( ['hands', hi, ci, 'selected'], v => !v ),
    };
  }
  
  static get initState(){
    return fromJS({
      index: 0,
      hands: [
        [],
        [],
      ],
      crib: [],
      cribOwner: 0,
      pegging: [],
      cut: {},
    });
  }

  componentWillMount(){
    this.props.deal();
  }
  
  render() {
    return (
      <div className="Round">
        <Hand cards={this.props.subState.getIn( ['hands', 0] )}
              hidden={true}
              onClick={ci => this.props.selectCard(0, ci)}/>
        
        <Hand cards={this.props.subState.getIn( ['hands', 1] )}
              onClick={ci => this.props.selectCard(1, ci)}/>
        
        <p>crib</p>
        <Hand cards={this.props.subState.get('crib')} />
        <p>cut</p>
        <Card card={this.props.subState.get('cut')}/>
      </div>
    );
  }
}

export default Round;
