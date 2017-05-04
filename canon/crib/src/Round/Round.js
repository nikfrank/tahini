import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import Pegging from '../Pegging';

import score from '../util/score';

import './Round.css';

class Round extends Component {
  static get actions(){
    return {
      next: ()=>({
        type: 'next',
      }),

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

      startPegging: ()=>({
        type: 'startPegging',
      }),
      
      endPegging: ()=>({
        type: 'endPegging',
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
      
      dealHands: (subState, { payload: cards }) =>
        subState
          .set('crib', fromJS( [] ) )
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

      startPegging: (subState, action) => subState.set('isPeggingPhase', true),
      endPegging: (subState, action) => subState.set('isPeggingPhase', false),

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
      isPeggingPhase: false,
      cribOwner: (Date.now() % 2),
      cut: {},
    });
  }

  componentWillMount(){
    this.props.deal();
  }

  componentWillReceiveProps(nuProps){
    const nuCut = nuProps.subState.get('cut').toJS();
    const oldCut = this.props.subState.get('cut').toJS();

    if(!oldCut.rank && nuCut.rank){
      // just did the cut

      const cribOwner = this.props.subState.get('cribOwner');
      const nonCrib = (1 + this.props.subState.get('cribOwner')) % 2;
      
      if ( nuCut.rank === 11 ) {
        this.props.onScoringEvent({
          player: cribOwner,
          type: 'crib dibs',
          pts: 2,
        });        
      }

      // put in the pegging round
      this.props.startPegging();

      // then after it is over
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

      this.props.onScoringEvent({
        player: cribOwner,
        type: 'crib',
        pts: score( this.props.subState.get( 'crib' ).toJS().concat( nuCut ) ),
      });
      
    }
  }
  
  sendToCrib = ()=>{
    this.props.sendToCrib(1);
    this.props.computerSendToCrib(
      this.props.subState.getIn( ['hands', 0] ),
      this.props.subState.get('cribOwner') === 0,
      121 - this.props.scoring.filter(se => se.player === 1)
                .reduce((p, c)=> (p + c.pts), 0)
    );
  }


  cut = ()=>{
    if (( this.props.subState.get('crib').size !== 4 )
        || ( this.props.subState.getIn( ['cut', 'rank'] ) )) return;
    else this.props.cut(
      this.props.subState.get('crib').toJS()
          .concat(this.props.subState.getIn( ['hands', 0] ).toJS())
          .concat(this.props.subState.getIn( ['hands', 1] ).toJS())
    );
  }

  nextHand = ()=>{
    this.props.next();
    this.props.deal();
  }
  
  render() {
    const showCut = (this.props.subState.get('crib').size === 4) &&
                    (!this.props.subState.getIn(['cut', 'rank']));

    const showSend = (this.props.subState.get('crib').size !== 4);

    const firstToPlay = (1 + this.props.subState.get('cribOwner')) % 2;

    const showPegging = this.props.subState.get('isPeggingPhase');
    
    return (
      <div className="Round">
        
        <div className="left">
          <Hand cards={this.props.subState.getIn( ['hands', 0] )}
                hidden={ !this.props.subState.getIn( ['cut', 'rank'] )}
                onClick={ci => this.props.selectCard(0, ci)}/>

          {
            showPegging ?
            <Pegging hands={this.props.subState.get('hands')}
                     onScoringEvent={this.props.onScoringEvent}
                     onComplete={this.props.endPegging}
                     firstToPlay={firstToPlay} /> : null
          }

          <Hand cards={this.props.subState.getIn( ['hands', 1] )}
                onClick={ci => this.props.selectCard(1, ci)}/>

        </div>

        
        <div className="right">

          <div className="cut">
            {
              showCut ?
              (<button onClick={this.cut}>cut</button>) : null
            }
            <Hand cards={[this.props.subState.get('cut')]}/>
          </div>

          <p>
            {
              ['Computer\'s ', 'my '][this.props.subState.get('cribOwner')]
            }
            crib
          </p>

          {
            showSend ?
            (<button onClick={this.sendToCrib}>
              Send cards to crib
            </button>) : null
          }
          <Hand cards={this.props.subState.get('crib')}
                hidden={ !this.props.subState.getIn( ['cut', 'rank'] )} />

          {
            !this.props.subState.getIn( ['cut', 'rank'] ) ? null :
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
                  Crib:
                  {
                    score( this.props.subState.get( 'crib' ).toJS().concat(
                      this.props.subState.get('cut').toJS() ) )
                  }
                  pts
                </p>
                <button onClick={this.nextHand}>Deal</button>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Round;
