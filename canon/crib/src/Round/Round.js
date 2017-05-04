import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import score from '../util/score';

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
                .set('pegging', fromJS([]) )
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
      pegging: [],
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
      // put in the pegging round      

      const cribOwner = this.props.subState.get('cribOwner');
      const nonCrib = (1 + this.props.subState.get('cribOwner')) % 2;
      
      if ( nuCut.rank === 11 ) {
        this.props.onScoringEvent({
          player: cribOwner,
          type: 'crib dibs',
          pts: 2,
        });        
      }
      
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
    return (
      <div className="Round">
        <Hand cards={this.props.subState.getIn( ['hands', 0] )}
              hidden={ !this.props.subState.getIn( ['cut', 'rank'] )}
              onClick={ci => this.props.selectCard(0, ci)}/>
        
        <Hand cards={this.props.subState.getIn( ['hands', 1] )}
              onClick={ci => this.props.selectCard(1, ci)}/>
        
        <p>
          {
            ['Computer\'s ', 'my '][this.props.subState.get('cribOwner')]
          }
          crib
        </p>
        <button onClick={this.sendToCrib}>
          Send cards to crib
        </button>
        <Hand cards={this.props.subState.get('crib')}
              hidden={ !this.props.subState.getIn( ['cut', 'rank'] )} />
        
        <button onClick={this.cut}>cut</button>
        <Hand cards={[this.props.subState.get('cut')]}/>
        {
          !this.props.subState.getIn( ['cut', 'rank'] ) ? null :
          (
            <div>
              <p>
                {
                  score( this.props.subState.getIn( ['hands', 0] ).toJS(),
                         this.props.subState.get('cut').toJS() )
                }
              </p>
              <p>
                {
                  score( this.props.subState.getIn( ['hands', 1] ).toJS(),
                         this.props.subState.get('cut').toJS() )
                }

              </p>
              <p>
                {
                  score( this.props.subState.get( 'crib' ).toJS().concat(
                    this.props.subState.get('cut').toJS() ) )
                }
              </p>
            </div>
          )
        }
        <button onClick={this.nextHand}>NEXT</button>
      </div>
    );
  }
}

export default Round;
