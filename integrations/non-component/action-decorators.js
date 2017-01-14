import { expect } from 'chai';

import { applyPartialAction } from '../../test-index';

describe('action decorators', ()=>{
  it('prints a field onto the action', ()=>{
    const actionCreator = ()=>({});
    const decoratedACs = applyPartialAction({meta:'metadata'})({actionCreator});
    
    expect(actionCreator()).to.eql({});
    expect(decoratedACs.actionCreator()).to.eql({meta:'metadata'});
  });
});
