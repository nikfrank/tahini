import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import Pegging from '../Pegging';

import score from '../util/score';

import style from './Round.css.js';

class Round extends Component {
  static get namespace(){
    return 'crib-Round';
  }

  static get actions(){
    return {
      next: ()=>({
        type: 'next',
      }),

      setCribOwner: o=>({ type: 'setCribOwner', payload: o }),

      deal: ()=>({
        network: {
          handler: 'GetDeal',
          payload: { size: 12 },
          nextAction: {
            type: 'dealHands',
          },
        }
      }),

      cut: (cards)=>({
        network: {
          handler: 'GetDeal',
          payload: {
            size: 1,
            burned: cards,
          },
          nextAction: {
            type: 'setCut',
          },
        },
      }),

      selectCard: (handIndex, cardIndex) => ({
        type: 'selectCard',
        payload: [handIndex, cardIndex],
      }),

      sendToCrib: handIndex => ({
        type: 'sendToCrib',
        payload: handIndex,
      }),

      setPhase: phase=>({
        type: 'setPhase',
        payload: phase
      }),
      
      computerSendToCrib: (hand, isCpCrib, target)=>({
        network: {
          handler: 'cpChooseCribCards',
          payload: { hand, isCpCrib, target },

          nextAction: {
            type: 'execCpSendToCrib',
          },
        },
      }),
    };
  }

  static get reducer(){
    return {
      next: (subState, action) =>
        subState.set( 'hands', fromJS([[],[]]) )
                .set('crib', fromJS([]) )
                .update('cribOwner', po => (po + 1)%2 )
                .set('cut', fromJS({}) ),

      setCribOwner: (subState, { payload }) => subState.set('cribOwner', payload),
      
      dealHands: (subState, { payload: cards }) =>
        subState
          .set('crib', fromJS( [] ) )
          .set('phase', 'select')
          .setIn( ['hands', 0], fromJS( cards.slice(0, 6) ) )
          .setIn( ['hands', 1], fromJS( cards.slice(6) ) ),

      selectCard: (subState, { payload: [hi, ci] }) =>
        subState
          .updateIn( ['hands', hi, ci, 'selected'], v => !v ),

      sendToCrib: (subState, { payload: hi }) => {
        const keep = subState.getIn( ['hands', hi] )
                             .filter( c => !c.get('selected') );

        const toss = subState.getIn( ['hands', hi] )
                             .filter( c => c.get('selected') );
        return (
          keep.size !== 4
        ) ? subState : subState
          .update('crib', crib => crib.concat(
            toss.map( c => c.set('selected', false)) ) )
        
          .setIn( ['hands', hi], keep );
      },

      setPhase: (subState, { payload: phase }) => subState.set('phase', phase),
      
      // check that this is still the correct hand
      execCpSendToCrib: (subState, { payload: { hand, crib } }) =>
        subState.update('crib', pcrib => pcrib.concat( crib ) )
                .setIn( ['hands', 0], hand ),


      setCut: (subState, { payload: [cut] }) =>
        subState.set('cut', fromJS(cut) ),
    };
  }
  
  static get initState(){
    return fromJS({
      hands: [
        [],
        [],
      ],
      crib: [],
      cribOwner: 0,
      phase: 'select',
      cut: {},
    });
  }

  componentWillMount(){
    this.props.deal();
    this.props.setCribOwner( this.props.cribOwner || 0 );
  }

  componentWillReceiveProps(nuProps){
    const nuCut = nuProps.subState.get('cut').toJS();
    const oldCut = this.props.subState.get('cut').toJS();

    const cribOwner = this.props.subState.get('cribOwner');
    const nonCrib = (1 + this.props.subState.get('cribOwner')) % 2;
    
    if(!oldCut.rank && nuCut.rank){
      // just did the cut
      
      if ( nuCut.rank === 11 ) {
        this.props.onScoringEvent({
          player: cribOwner,
          type: 'crib dibs',
          pts: 2,
        });        
      }

      // put in the pegging round
      this.props.setPhase('peg');
      this.Pegging =
        this.props.getDevice( Pegging, ['peg'], Pegging.initState.merge({
          hands: this.props.subState.get('hands'),
          nextToPlay: (1 + this.props.subState.get('cribOwner')) % 2,
        }));
    }

    if ( (nuProps.subState.get('phase') === 'score') &&
         (this.props.subState.get('phase') !== 'score') ){
      this.props.setPhase('post-score');
      
      this.props.onScoringEvent({
        player: nonCrib,
        type: 'nonCrib hand',
        pts: score( this.props.subState.getIn( ['hands', nonCrib] ).toJS(),
                    nuCut),
      });

      this.props.onScoringEvent({
        player: cribOwner,
        type: 'cribOwner hand',
        pts: score( this.props.subState.getIn( ['hands', cribOwner] ).toJS(),
                    nuCut),
      });


      const cribCut = (nuCut.rank !== 11) ?
                      { suit: nuCut.suit } : {};

      this.props.onScoringEvent({
        player: cribOwner,
        type: 'crib',
        pts: score( this.props.subState.get( 'crib' ).toJS()
                        .concat( nuCut ), cribCut),
      });
    }
  }
  
  sendToCrib = ()=>{
    this.props.sendToCrib(1);

    const cpHand = this.props.subState.getIn( ['hands', 0] );
    
    if( cpHand.size === 6 )
      this.props.computerSendToCrib(
        cpHand,
        this.props.subState.get('cribOwner') === 0,
        121 - this.props.scoring.filter(se => se.player === 1)
                  .reduce((p, c)=> (p + c.pts), 0)
      );
  }


  cut = ()=>{
    if (( this.props.subState.get('crib').size !== 4 )
        || ( this.props.subState.getIn( ['cut', 'rank'] ) )) return;
    else {
      this.props.cut(
        this.props.subState.get('crib').toJS()
            .concat(this.props.subState.getIn( ['hands', 0] ).toJS())
            .concat(this.props.subState.getIn( ['hands', 1] ).toJS())
      );
      this.props.setPhase('peg');
    }
  }

  nextHand = ()=>{
    this.props.next();
    this.props.deal();
  }
  
  render() {
    const showCut = (this.props.subState.get('crib').size === 4);
    const cutYet = this.props.subState.getIn(['cut', 'rank']);
    
    const showSend = (this.props.subState.get('crib').size !== 4);

    const showPegging = this.props.subState.get('phase') === 'peg';
    const showHands = this.props.subState.get('phase') === 'post-score';

    const PeggingDevice = this.Pegging;

    const cribCut = (this.props.subState.getIn(['cut', 'rank']) !== 11) ?
                    ({ suit: this.props.subState.getIn(['cut', 'suit']) }) : {};
    return (
      <div style={style.container}>
        
        {
          showPegging ? (
            <PeggingDevice
                onScoringEvent={this.props.onScoringEvent}
                onComplete={() => this.props.setPhase('score')} />
          ) : (
            <div>
              <Hand cards={this.props.subState.getIn( ['hands', 0] )}
                    hidden={ !showHands }
                    onClick={() => 0}/>

              {
                showSend ?
                (<button className="Round--send-to-crib"
                         style={style.cut}
                         onClick={this.sendToCrib}>
                  Send cards to
                  {[' computer\'s ', ' my '][
                     this.props.subState.get('cribOwner')
                   ]}
                  crib
                </button>) : null
              }
              <Hand cards={this.props.subState.get('crib')}
                    hidden={ !showHands } />
              
              <Hand cards={this.props.subState.getIn( ['hands', 1] )}
                    onClick={ci => this.props.selectCard(1, ci)}/>
            </div>
          )
          
        }

        {
          showCut && !cutYet ? (
            <button style={style.cut} onClick={this.cut}>cut</button>
          ) : null
        }


        {
          cutYet? (
            <div style={style.cut}>
              <Hand cards={[this.props.subState.get('cut')]}/>
            </div>
          ) : null
        }

        {
          !showHands ? null :
          (
            <div>
              <p>
                Computer's hand:
                {
                  score( this.props.subState.getIn( ['hands', 0] ).toJS(),
                         this.props.subState.get('cut').toJS() )
                }
                pts
              </p>
              <p>
                My hand:
                {
                  score( this.props.subState.getIn( ['hands', 1] ).toJS(),
                         this.props.subState.get('cut').toJS() )
                }
                pts
              </p>
              <p>
                {
                  ['Computer\'s ', 'my '][this.props.subState.get('cribOwner')]
                }
                Crib:
                {
                  score(
                    this.props.subState.get( 'crib' ).toJS().concat(
                      this.props.subState.get('cut').toJS() ),
                    cribCut
                  )
                }
                pts
              </p>
              <button className="Round--next-hand"
                      onClick={this.nextHand}>Deal</button>
            </div>
          )
        }
      </div>
          );
  }
}

export default Round;
