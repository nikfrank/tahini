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

      playCard: (subState, { payload: [hi, ci] }) =>
        (
          // out of turn
          (subState.get('nextToPlay') !== hi) &&
          (subState.getIn(['hands', subState.get('nextToPlay')]).size)
        ) ? subState : (

          // passing
          ci === null
        ) ? subState.update('played', pl =>
          pl.push( fromJS({ card: {}, player: hi }))
        ).set('nextToPlay', (hi + 1)%2) : (
          
          // block stack tipping
          subState.getIn( ['hands', hi] ).map( card => {
            const played = subState.get('played').toJS();
            const currentCount = pegScore( played ).count;
            return pegScore( played.concat({
              card: card.toJS()
            }) ).count > currentCount;
          }).reduce( (p, c)=> (p || c), false) && (

            pegScore(
              subState
                .get('played').toJS()
                .concat({
                  card: subState.getIn(['hands', hi, ci]).toJS()
                })
            ).count < pegScore( subState.get('played').toJS() ).count
            // if there is a way to play where count goes up
          ) 
        ) ? subState : (
            
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

  componentDidMount(){
    setTimeout(()=>
      this.props.onDidMount(), 900);
  }
  
  componentWillMount(){
    if (this.props.subState.get('nextToPlay') === 0)
      setTimeout(()=>
        this.props.cpPegFromHand(
          this.props.subState.getIn( ['hands', 0] ).toJS(),
          this.props.subState.get('played').toJS()
        ), 900);
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

      setTimeout(()=> this.props.onComplete(), 800);
      

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
    const stackCards = fromJS(stack)
      .filter( pl => !!pl.getIn(['card', 'rank']) );

    const minStackCards = stackCards
      .map( pl => pl.get('card') )
      .concat( fromJS(
        Array( Math.max(0, 6 - stackCards.size) ).fill({})
      ) );

    const cpHand = this.props.subState.getIn( ['hands', 0] )
    const cpHandFill = cpHand.concat( fromJS(
      Array( 4 - cpHand.size ).fill({})
    ) );

    const p1Hand = this.props.subState.getIn( ['hands', 1] )
    const p1HandFill = p1Hand.concat( fromJS(
      Array( 4 - p1Hand.size ).fill({})
    ) );
    
    return (
      <div className="Pegging" style={{
        position: 'fixed', top: 40, left: 0, bottom: 0, right: 0
      }}>
        <Hand cards={cpHandFill}
              hidden={true}
              onClick={() => 0}/>

        <div style={{
          position: 'fixed', left: 5, top: '54vh',
          height: 45, width: 45, fontSize: 30, fontWeight: 'bold',
          textAlign: 'center', lineHeight: 1.5, color: 'darkgreen',
          border: '3px solid darkgreen', backgroundColor: 'white',
          borderRadius: '50%',
        }}>
          { count }
        </div>

        <div style={{ paddingLeft: 'calc( 1vw - 100px )' }}>
          <Hand cards={minStackCards}/>
        </div>
        
        <Hand cards={p1HandFill}
              onClick={ci => this.props.playCard(ci)}/>
        
      </div>
    );
  }
}

export default Pegging;
