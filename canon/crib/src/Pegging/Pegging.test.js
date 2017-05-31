import React from 'react';
import ReactDOM from 'react-dom';

import { mount } from 'enzyme';
import { fromJS } from 'immutable';

import {
  Base,
  bootStores,
  connectDeviceFactory,
  networkMiddleware,

  getNextState,
  toJS,
  rejectify,
} from 'tahini';

const { it, expect } = global;

import Pegging from './Pegging';
import Card, { CardBack } from '../pure/Card';
import Hand from '../pure/Hand';

import networkHandlers from '../network/';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render( (
    <Pegging subState={ Pegging.initState }
             cpPegFromHand={jest.fn()}
             deal={jest.fn()}/>
  ), div);

  // expect the spy to be called
  // expect the deal action to resolve a network handler
  // expect his nextAction to load the hands
});

it('plays a card nu', ()=>{

  const action = Pegging.actions.playCard(0);

  const hand = [
    { rank: 1, suit: 0 },
    { rank: 2, suit: 1 },
    { rank: 3, suit: 2 },
    { rank: 3, suit: 3 },
    { rank: 4, suit: 1 },
    { rank: 5, suit: 2 },
  ];
        
  const iS = Pegging.initState.setIn( [ 'hands', 1 ], fromJS(hand) );
  const nS = Pegging.reducer.playCard( iS, action );
  
  // in the case there are 4 unselected cards in the hand
  //   expect the cards to be moved to the crib

  const xS = Pegging.initState
                    .setIn( [ 'hands', 1 ],
                            fromJS( hand.slice(1) ) )
                    .set( 'nextToPlay', 0)
                    .set( 'played', fromJS( [{ card: hand[0], player: 1}] ) );

  expect( nS ).toEqual( xS );
  
});


// cases for a couple different hands
// click the cards in order politely
// click a bunch of times, during my turn and during cps
// click after I'm done playing, while cp is
// click cp's cards
// click stack cards

// in each case, expect the correct scoring to occur



it('plays cp crib hand', () => {
  let getDevice, appStore, PeggingD;

  const dataPath = [];
  
  const stores = bootStores( [ networkMiddleware(networkHandlers) ] );
  ({ getDevice } = connectDeviceFactory( stores ));
  ({ appStore } = stores);

  const handInitState = Pegging.initState.merge({
    hands: [
      [
        { rank:1, suit:0 },
        { rank:1, suit:1 },
        { rank:1, suit:2 },
        { rank:1, suit:3 },
      ],
      
      [
        { rank:2, suit:0 },
        { rank:2, suit:1 },
        { rank:2, suit:2 },
        { rank:2, suit:3 },
      ],
    ],
    nextToPlay: 1,
  });
  
  PeggingD = getDevice(Pegging, dataPath, handInitState);
  
  const complete = jest.fn();
  const scoring = jest.fn();
  
  const p = mount(
    <PeggingD onComplete={complete} onScoringEvent={scoring}/>
  );

  const cards = p.find(Card);
  const cardbacks = p.find(CardBack);
  const hands = p.find(Hand);

  return [1, 2, 3, 4].reduce((s, c)=>
    s.then(()=> p.find(Card))
     .then(getNextState(
       appStore,
       cards => cards.last().simulate('click')
     )).then(toJS)

     .then( rejectify( state => {
       expect( state.played ).toHaveLength(2 * c - 1);
       expect( state.hands[0] ).toHaveLength(5 - c);
       expect( state.hands[1] ).toHaveLength(4 - c);
       
     }) )

     .then(getNextState(appStore)).then(toJS)
     .then( rejectify( state => {
       expect( state.played ).toHaveLength(2 * c);
       expect( state.hands[0] ).toHaveLength(4 - c);
       expect( state.hands[1] ).toHaveLength(4 - c);
       
     })
     ), Promise.resolve()
    
  ).then( rejectify(()=>{
    expect( complete.mock.calls ).toHaveLength(1);
    expect( scoring.mock.calls ).toHaveLength(1); // peg end
  }))
});


it('plays my crib hand', () => {
  let getDevice, appStore, PeggingD;

  const dataPath = [];
  
  const stores = bootStores( [ networkMiddleware(networkHandlers) ] );
  ({ getDevice } = connectDeviceFactory( stores ));
  ({ appStore } = stores);

  const handInitState = Pegging.initState.merge({
    hands: [
      [
        { rank:1, suit:0 },
        { rank:1, suit:1 },
        { rank:1, suit:2 },
        { rank:1, suit:3 },
      ],
      
      [
        { rank:2, suit:0 },
        { rank:2, suit:1 },
        { rank:2, suit:2 },
        { rank:2, suit:3 },
      ],
    ],
    nextToPlay: 0,
  });
  
  PeggingD = getDevice(Pegging, dataPath, handInitState);
  
  const complete = jest.fn();
  const scoring = jest.fn();
  
  const p = mount(
    <PeggingD onComplete={complete} onScoringEvent={scoring}/>
  );

  const cards = p.find(Card);
  const cardbacks = p.find(CardBack);
  const hands = p.find(Hand);


  return [1, 2, 3, 4].reduce((s, c)=>
    s.then(()=> p.find(Card))
       
     .then(getNextState(
       appStore,
       cards => cards.last().simulate('click')
     )).then(toJS)
    
     .then( rejectify( state => {
       expect( state.played ).toHaveLength( 2 * c );
       expect( state.hands[0] ).toHaveLength(4 - c);
       expect( state.hands[1] ).toHaveLength(4 - c); 
     })
     ).then( c < 4 ? getNextState(appStore) : ()=>0
     ), Promise.resolve()
    
  ).then( rejectify(()=>{
    
    expect( complete.mock.calls ).toHaveLength(1);
    expect( scoring.mock.calls ).toHaveLength(1);
     
 }))
});

// still need to test passing, trolling
// (can play low, play over 31)
// (clicking when not allowed to play)

// all testing that scoring is correct
