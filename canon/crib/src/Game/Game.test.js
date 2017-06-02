import React from 'react';
import ReactDOM from 'react-dom';

import { mount } from 'enzyme';

import {
  Base,
  bootStores,
  connectDeviceFactory,
  networkMiddleware,

  getNextState,
  toJS,
} from 'tahini';

import networkHandlers from '../network/';

import Game from './';

const { it } = global;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Game subState={ Game.initState }
                        getDevice={ jest.fn().mockReturnValue(Base) }/>, div);
});

it('cp can win game', ()=>{
  let getDevice, appStore, GameD;
  
  const stores = bootStores( [ networkMiddleware(networkHandlers) ] );
  
  ({ getDevice } = connectDeviceFactory( stores ));
  ({ appStore } = stores);

  const dataPath = [];
  GameD = getDevice(Game, dataPath, Game.initState);
  
  const p = mount(
    <GameD />
  );

  const state = appStore.getState().toJS()

  expect( state.scores ).toEqual( [0, 0] );
  expect( state.winner ).toEqual( -1 );
  expect( state.currentHand.hands ).toHaveLength( 2 );
  expect( state.currentHand.hands[0] ).toHaveLength( 6 );
  expect( state.currentHand.hands[1] ).toHaveLength( 6 );

  return Promise
    .resolve()
    .then( getNextState(
      appStore,
      ()=> appStore.dispatch({
        ...Game.actions.trackScoringEvent({ player: 0, pts: 500 }),
        dataPath, namespace: Game.namespace
      })
    ) ).then(toJS)
    .then( state => {
      expect( state.scores ).toEqual( [500, 0] );
      expect( state.winner ).toEqual( 0 );
    })
  
  
    .then( getNextState(
      appStore,
      ()=> appStore.dispatch({
        ...Game.actions.trackScoringEvent({ player: 1, pts: 500 }),
        dataPath, namespace: Game.namespace
      })
    ) ).then(toJS)
    .then( state => {
      expect( state.scores ).toEqual( [500, 0] );
      expect( state.winner ).toEqual( 0 );
    })
});


it('p1 can win game', ()=>{
  let getDevice, appStore, GameD;
  
  const stores = bootStores( [ networkMiddleware(networkHandlers) ] );
  
  ({ getDevice } = connectDeviceFactory( stores ));
  ({ appStore } = stores);

  const dataPath = [];
  GameD = getDevice(Game, dataPath, Game.initState);
  
  const p = mount(
    <GameD />
  );

  const state = appStore.getState().toJS()

  expect( state.scores ).toEqual( [0,0] );
  expect( state.winner ).toEqual( -1 );
  expect( state.currentHand.hands ).toHaveLength( 2 );
  expect( state.currentHand.hands[0] ).toHaveLength( 6 );
  expect( state.currentHand.hands[1] ).toHaveLength( 6 );

  return Promise
    .resolve()
    .then( getNextState(
      appStore,
      ()=> appStore.dispatch({
        ...Game.actions.trackScoringEvent({ player: 1, pts: 50 }),
        dataPath, namespace: Game.namespace
      })
    ) ).then(toJS)
    .then( state => {
      expect( state.scores ).toEqual( [0, 50] );
      expect( state.winner ).toEqual( -1 );
    })
  
    .then( getNextState(
      appStore,
      ()=> appStore.dispatch({
        ...Game.actions.trackScoringEvent({ player: 1, pts: 450 }),
        dataPath, namespace: Game.namespace
      })
    ) ).then(toJS)
    .then( state => {
      expect( state.scores ).toEqual( [0, 500] );
      expect( state.winner ).toEqual( 1 );
    })
  
  
    .then( getNextState(
      appStore,
      ()=> appStore.dispatch({
        ...Game.actions.trackScoringEvent({ player: 0, pts: 500 }),
        dataPath, namespace: Game.namespace
      })
    ) ).then(toJS)
    .then( state => {
      expect( state.scores ).toEqual( [0, 500] );
      expect( state.winner ).toEqual( 1 );
    })
});
