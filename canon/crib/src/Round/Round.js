import React, { Component } from 'react';
import { fromJS } from 'immutable';

import Hand from '../pure/Hand';
import Card from '../pure/Card';

import Pegging from '../Pegging';

import score from '../util/score';

import style from './Round.css';

const commonScoreStyle = {
  position: 'fixed', color: 'red', fontWeight: 'bold', fontSize: 30,
  backgroundColor: '#eee',
  boxShadow: '5px 4px #333',
  borderRadius: '50%',
  border: '3px solid red',
  textAlign: 'center',
  lineHeight: 1.5,
  height: 45, width: 45,
};

const scoreStyles = [{
  left: '4vw', top: '21vh',
  ...commonScoreStyle,
}, {
  right: '4vw', bottom: '7vh',
  ...commonScoreStyle,
}, {
  left: '4vw', top: '54vh',
  ...commonScoreStyle,
}, {
  right: '4vw', top: '54vh',
  ...commonScoreStyle,
}];



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
        if ( this.props.scores.get( cribOwner ) < 116 )
          this.props.onScoringEvent({
            player: cribOwner,
            type: 'crib dibs',
            pts: 2,
          });
      }

      // put in the pegging round
//      this.props.setPhase('peg');
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
      this.props.setPhase('post-select');

      setTimeout(()=> this.props.setPhase('pre-peg'), 320);
    }
  }

  nextHand = ()=>{
    this.props.next();
    this.props.deal();
  }
  
  render() {
    const phase = this.props.subState.get('phase');

    const showCut = (this.props.subState.get('crib').size === 4) ;
    const cut = this.props.subState.get('cut');
    const cutYet = !! cut.get('rank');
    
    const showSend = (this.props.subState.get('crib').size !== 4);

    const showPegging = phase.indexOf('peg') > -1;
    const showRound = phase !== 'peg';
    
    const showHands = phase === 'post-score';

    const PeggingDevice = this.Pegging;

    const cribCut = (this.props.subState.getIn(['cut', 'rank']) !== 11) ?
                    ({ suit: this.props.subState.getIn(['cut', 'suit']) }) : {};

    const cpHand = this.props.subState.getIn( ['hands', 0] );
    const p1Hand = this.props.subState.getIn( ['hands', 1] );

    const andCut = ( phase === 'post-score' ) ?
                   fromJS( [{}, cut] ) : fromJS([]);
    
    return (
      <div style={style.container}>
        
        {
        showPegging ? (
        <PeggingDevice
            onDidMount={()=> this.props.setPhase('peg')}
            onScoringEvent={this.props.onScoringEvent}
            onComplete={() => this.props.setPhase('score')} />
          ) : null
        }
        {
          showRound ? (
            <div>
              <Hand cards={ cpHand.concat( andCut ) }
                    hidden={ !showHands }
                    onClick={() => 0}/>

              {
                showSend ?
                (<button className="Round--send-to-crib"
                         style={style.cutButton}
                         onClick={this.sendToCrib}>
                  Send to
                  {[' CP ', ' my '][
                     this.props.subState.get('cribOwner')
                   ]}
                  crib
                </button>) : null
              }
              <Hand cards={this.props.subState.get('crib').concat( andCut )}
                    onClick={()=>0}
                    hidden={ !showHands } />
              
              <Hand cards={ p1Hand.concat( andCut ) }
                    hidden={false}
                    onClick={ci => this.props.selectCard(1, ci)}/>
            </div>
          ) : null
          
        }

        {
          showCut && !cutYet ? (
            <button style={style.cutButton} onClick={this.cut}>Cut</button>
          ) : null
        }


        {
          ( ( phase === 'post-select' ) || ( phase === 'pre-peg' ) ) ? (
            <div style={style.cut}>
              <Hand cards={[this.props.subState.get('cut')]}/>
            </div>
          ) : null
        }

        {
          !showHands ? null :
          (
            <div>
              <div style={scoreStyles[0]}>
                {
                  score( this.props.subState.getIn( ['hands', 0] ).toJS(),
                         this.props.subState.get('cut').toJS() )
                }
              </div>
              
              <div style={scoreStyles[1]}>
                {
                  score( this.props.subState.getIn( ['hands', 1] ).toJS(),
                         this.props.subState.get('cut').toJS() )
                }
              </div>
              
              <div style={scoreStyles[2+this.props.subState.get('cribOwner')]}>
                {
                  score(
                    this.props.subState.get( 'crib' ).toJS().concat(
                      this.props.subState.get('cut').toJS() ),
                    cribCut
                  )
                }
              </div>

              {
                this.props.winner > -1 ? (
                  <button style={style.cutButton} onClick={this.props.nuGame}>
                    {['CP', 'You'][this.props.winner]} won!<br/>New Game
                  </button>
                ) : (
                  <button className="Round--next-hand"
                          style={style.cutButton}
                          onClick={this.nextHand}>Deal</button>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default Round;
