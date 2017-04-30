import React from 'react';
import ReactDOM from 'react-dom';
import Round from './Round';

import { fromJS } from 'immutable';

const { it, expect } = global;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render( (
    <Round subState={ Round.initState }
           deal={jest.fn()}/>
  ), div);

  // expect the spy to be called
  // expect the deal action to resolve a network handler
  // expect his nextAction to load the hands
});

it('selects cards for the crib', ()=>{

  const action = Round.actions.sendToCrib(0);

  const hand = [
    { rank: 1, suit: 0 },
    { rank: 2, suit: 1 },
    { rank: 3, suit: 2 },
    { rank: 3, suit: 3 },
    { rank: 4, suit: 1, selected: true },
    { rank: 5, suit: 2, selected: true },
  ];
        
  const iS = Round.initState.setIn( [ 'hands', 0 ], fromJS(hand) );
  const nS = Round.reducer.sendToCrib( iS, action );
  
  // in the case there are 4 unselected cards in the hand
  //   expect the cards to be moved to the crib

  const xS = Round.initState
                  .setIn( [ 'hands', 0 ],
                          fromJS( hand.filter( c => !c.selected ) ) )
                  .set( 'crib', fromJS( hand.filter( c => c.selected ) ) );

  expect( nS ).toEqual( xS );
  
  
  // otherwise, expect not

  const fiS = Round.initState.setIn( [ 'hands', 0 ], fromJS( hand.slice(1) ) );
  const fnS = Round.reducer.sendToCrib( fiS, action );

  expect( fiS === fnS ).toEqual( true );
});
