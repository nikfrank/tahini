import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import pegScore from '../util/pegScore';

class Pegging extends Component {
  static get namespace(){
    return 'crib-Pegging';
  }
  
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

      // if the player tries to play a card that goes > 31,
      // but has one that doesn't. don't allow!
      playCard: (subState, { payload: [hi, ci] }) =>
        (
          (subState.get('nextToPlay') !== hi) &&
          (subState.getIn(['hands', subState.get('nextToPlay')]).size)
        ) ? subState : (
          
          ci === null
        ) ? subState.update('played', pl =>
          pl.push( fromJS({ card: {}, player: hi }))
        ).set('nextToPlay', (hi + 1)%2) : (
          
          subState
            .update('played', pl =>
              pl.push( fromJS({
                card: subState.getIn( ['hands', hi, ci] ),
                player: hi,
              })))
            .updateIn(['hands', hi],
                      hand => hand.slice(0, ci).concat( hand.slice(ci+1) ))
            .set('nextToPlay', (hi + 1)%2) ),
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

    if ( ( played === prevPlayed ) || ( !played.size ) )
      if ( ( nuProps.subState.getIn(['hands', 1]).size === 0 ) &&
           ( nuProps.subState.getIn(['hands', 0]).size > 0 ) ) {
        return this.props.playCard( null );
      } else return;

    const { score, player, count, stack } = pegScore( played.toJS() );

    // if there are no cards in nextToPlay's hand send {}
    const passes = stack.reduce( (p, c) => (c.card.rank? 0 : p+1) , 0);
    
    if ( score )
      this.props.onScoringEvent({ player, type: 'peg', pts: score });
    
    // if all the cards are played, onComplete
    if ( nuProps.subState.getIn(['hands', 0]).size +
         nuProps.subState.getIn(['hands', 1]).size === 0) {

      if( count !== 31 )
        this.props.onScoringEvent({ player, type: 'peg-end', pts: 1 });
      
      this.props.onComplete();
      

      // have to pass
    } else if (( nuProps.subState.get('nextToPlay') === 1 ) &&
               ( passes < 2 ) &&
               ( !nuProps.subState.getIn(['hands', 1])
                         .filter( c => (
                           Math.min(10, c.get('rank')) + count <= 31 ) ).size ))
      this.props.playCard(null);
    
    // if nextToPlay is 0 trigger computer play
    else if ( nuProps.subState.get('nextToPlay') === 0 )
      setTimeout(() =>
        this.props.cpPegFromHand(
          nuProps.subState.getIn(['hands', 0]).toJS(),
          nuProps.subState.get('played').toJS()
        ), 500);
  }

  
  render() {
    const { count, stack } = pegScore( this.props.subState.get('played').toJS() );
    const stackCards = fromJS(stack);
    
    return (
      <div className="Pegging">
        <Hand cards={this.props.subState.getIn( ['hands', 0] )}
              hidden={true}
              onClick={() => 0}/>

        { count }
        <Hand cards={stackCards.map( pl => pl.get('card') )} />
        
        <Hand cards={this.props.subState.getIn( ['hands', 1] )}
              onClick={ci => this.props.playCard(ci)}/>
        
      </div>
    );
  }
}

export default Pegging;
