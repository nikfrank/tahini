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



it('plays a hand', () => {
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
  
  const deal = jest.fn();
  const cpPeg = jest.fn();

  const p = mount(
    <PeggingD />
  );

  const cards = p.find(Card);
  const cardbacks = p.find(CardBack);
  const hands = p.find(Hand);

  console.log(cards.length, cardbacks.length, hands.length);

  return Promise
    .resolve()
    .then(()=> p.find(Card))
    .then(cards => cards.last().simulate('click'))
    .then(getNextState(appStore)).then(toJS)
    .then( rejectify( state => {
      
      expect( state.played ).toHaveLength(2);
      expect( state.hands[0] ).toHaveLength(3);
      expect( state.hands[1] ).toHaveLength(3);
      
    }) )

  
    .then(()=> p.find(Card))
    .then(cards => cards.last().simulate('click'))
    .then(getNextState(appStore)).then(toJS)
    .then( rejectify( state => {
      
      expect( state.played ).toHaveLength(4);
      expect( state.hands[0] ).toHaveLength(2);
      expect( state.hands[1] ).toHaveLength(2);
      
    }) )  
});


// there's a pattern here
// sim event
// wait for next state := (subscribe -> unsubscribe, next function)

// :::::
// then( ()=> p.find(...) )
// then( simulate(whatever) )
// then( getNextState )
// then( state=> expect(something) )

