import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import pegScore from '../util/pegScore';

class Pegging extends Component {
  static get actions(){
    return {

      // selectCard -> then play card?
      playCard: ci => ({
        type: 'playCard',
        payload: [1, ci],
      }),

      cpPegFromHand: (hand, played)=>({
        network: {
          handler: 'cpPegFromHand',
          payload: { hand, played },
          nextAction: {
            type: 'playCard',
          },
        },
      }),
    };
  }

  static get reducer(){
    return {
      playCard: (subState, { payload: [hi, ci] }) =>
        (subState.get('nextToPlay') !== hi) ? subState :
        subState
          .update('played', pl =>
            pl.push( fromJS({
              card: subState.getIn( ['hands', hi, ci] ),
              player: hi,
            })))
          .updateIn(['hands', hi],
                    hand => hand.slice(0, ci).concat( hand.slice(ci+1) ))
          .set('nextToPlay', (hi + 1)%2),
    };
  }
  
  static get initState(){
    return fromJS({
      hands: [
        [],
        [],
      ],
      nextToPlay: 1,
      played: [],
    });
  }

  componentWillMount(){
    if (this.props.subState.get('nextToPlay') === 0)
      this.props.cpPegFromHand(
        this.props.subState.getIn( ['hands', 0] ).toJS(),
        this.props.subState.get('played').toJS()
      );
  }
  
  componentWillReceiveProps(nuProps){
    // if the last play triggers points, onScoringEvent
    const played = nuProps.subState.get('played');
    const prevPlayed = this.props.subState.get('played');

    if ( ( played === prevPlayed ) || ( !played.size ) ) return;

    const { score, player, count, stack } = pegScore( played.toJS() );

    // pull out cards on current stack

    console.log(score, player, count, stack);
    // if there are no cards in nextToPlay's hand send {}
    
    
    // if nextToPlay is 0 trigger computer play
    if (nuProps.subState.get('nextToPlay') === 0)
      this.props.cpPegFromHand(
        nuProps.subState.getIn(['hands', 0]).toJS(),
        nuProps.subState.get('played').toJS()
      );

    // if all the cards are played, onComplete
    else if ( this.props.subState.getIn(['hands', 0]).size +
              this.props.subState.getIn(['hands', 1]).size === 0)
      this.props.onComplete();
  }

  
  render() {
    const { count, stack } = pegScore( this.props.subState.get('played').toJS() );
    const stackCards = fromJS(stack);
    
    return (
      <div className="Pegging">
        { this.props.subState.get('nextToPlay') }
        <Hand cards={this.props.subState.getIn( ['hands', 0] )}
              hidden={true}
              onClick={() => 0}/>

        { count }
        <Hand
            cards={stackCards.map( pl => pl.get('card') )}
        />
        
        <Hand cards={this.props.subState.getIn( ['hands', 1] )}
              onClick={ci => this.props.playCard(ci)}/>
        
      </div>
    );
  }
}

export default Pegging;
