import React from 'react';
import ReactDOM from 'react-dom';
import Pegging from './Pegging';

import { fromJS } from 'immutable';

const { it, expect } = global;

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
                  .set( 'played', fromJS( [{ card: hand[0], player: 1}] ) );

  expect( nS ).toEqual( xS );
  
});
