import React from 'react';
import ReactDOM from 'react-dom';

import { mount } from 'enzyme';
import { fromJS } from 'immutable';

import {
  bootStores,
  connectDeviceFactory,
  networkMiddleware,

  getNextState,
  toJS,
} from 'tahini';

import Round from './Round';
import Card from '../pure/Card';

import networkHandlers from '../network/';
import cpChooseCribCardsMock from '../network/cpChooseCribCards/mock';

const { it, expect, jsamine } = global;

//jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render( (
    <Round subState={ Round.initState }
           setCribOwner={jest.fn()}
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
                  .set( 'crib', fromJS(
                    hand.filter( c => c.selected )
                        .map( c => ({ ...c, selected:false }))
                  ) );

  expect( nS ).toEqual( xS );
  
  
  // otherwise, expect not

  const fiS = Round.initState.setIn( [ 'hands', 0 ], fromJS( hand.slice(1) ) );
  const fnS = Round.reducer.sendToCrib( fiS, action );

  expect( fiS === fnS ).toEqual( true );
});



it('deals a hand when mounted', ()=>{
  let getDevice, appStore, RoundD;
  
  const stores = bootStores( [ networkMiddleware({
    ...networkHandlers,
    cpChooseCribCards: cpChooseCribCardsMock,
  }) ] );
  
  ({ getDevice } = connectDeviceFactory( stores ));
  ({ appStore } = stores);

  const dataPath = [];
  RoundD = getDevice(Round, dataPath, Round.initState);

  const onScoring = jest.fn();
  
  const p = mount(
    <RoundD scoring={[{player:1, pts: 0}]} onScoringEvent={onScoring}/>
  );

  // check that the state has been dealt

  const state = appStore.getState().toJS();

  expect( state.hands ).toHaveLength(2);
  expect( state.hands[0] ).toHaveLength(6);
  expect( state.hands[1] ).toHaveLength(6);

  return Promise
    .resolve()

    .then( ()=> p.find(Card) )
    .then( getNextState(
      appStore,
      cards => cards.at(0).simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.hands[1].filter( c => c.selected ) ).toHaveLength(1);
    })

    .then( ()=> p.find('button.Round--send-to-crib') )
    .then( getNextState(
      appStore,
      button => button.simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.hands[0] ).toHaveLength(6)
      expect( state.hands[1] ).toHaveLength(6)
      expect( state.crib ).toHaveLength(0)
    })
  
    .then( ()=> p.find(Card) )
    .then( getNextState(
      appStore,
      cards => cards.at(1).simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.hands[0] ).toHaveLength(4)
      expect( state.crib ).toHaveLength(2)
      expect( state.hands[1].filter( c => c.selected ) ).toHaveLength(2);
    })
  
    .then( ()=> p.find('button.Round--send-to-crib') )
    .then( getNextState(
      appStore,
      button => button.simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.hands[0] ).toHaveLength(4)
      expect( state.hands[1] ).toHaveLength(4)
      expect( state.crib ).toHaveLength(4)
    })

  // for some reason the nextAction doesn't trigger a props call here...
  // so I'll force one through with a meaningless change
    .then( ()=> p.find(Card) )
    .then( getNextState(
      appStore,
      cards => cards.at(1).simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.hands[0] ).toHaveLength(4)
      expect( state.hands[1] ).toHaveLength(4)
      expect( state.crib ).toHaveLength(4)
    })

    .then( ()=> p.find('.cut-button') )
    .then( getNextState(
      appStore,
      button => button.simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.cut.rank ).toBeGreaterThan(0);
      expect( state.cut.rank ).toBeLessThan(14);
      expect( state.cut.suit ).toBeGreaterThan(-1);
      expect( state.cut.suit ).toBeLessThan(4);
    })

    .then( ()=> p.find(Card) )
    .then( getNextState(
      appStore,
      cards => cards.at(1).simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.phase ).toEqual('post-select');
    })

  
  // here I'll magically skip the pegging phase
    .then( getNextState(
      appStore,
      ()=> appStore.dispatch({
        ...Round.actions.setPhase('score'),
        dataPath, namespace: Round.namespace
      })
    ) ).then(toJS)
    .then( state => {
      expect( state.phase ).toEqual( 'post-score' );
      expect( onScoring.mock.calls.length ).toBeGreaterThan( 2 );

      expect( onScoring.mock.calls.slice(-3).map( e => e[0].type ) )
        .toEqual(['nonCrib hand', 'cribOwner hand', 'crib']);
    })

  // next hand!
    .then( ()=> p.find('button.Round--next-hand') )
    .then( getNextState(
      appStore,
      nextButton => nextButton.simulate('click')
    ) ).then(toJS)
    .then( state => {
      expect( state.hands[0] ).toHaveLength(0);
      expect( state.hands[1] ).toHaveLength(0);
      expect( state.cut ).toEqual({});
    })
  
});
