import { Component, createElement } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

let defaultProps = { exposures:{}, getDevice:()=>Base };

class Base extends Component {
  constructor(props){
    super(props);
    this.pureComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  shouldComponentUpdate(...args) {
    return this.pureComponentUpdate(...args);
  }

  static get defaultProps(){
    return defaultProps; // use this to pass actionCreators from children to parents
  }

  static set defaultProps(ndp){
    defaultProps = ndp;
  }
  
  static get actions(){
    // toss no-actions-warning
    return {};
    // {[actionType]: (payload)=>({type:actionType, payload}),..}
  }

  static get reducer(){
    // toss no-reducer-warning
    return {};
    // {[actionType]: (subState, action)=> { /*...*/; return nuSubState; },..}
  }

  static get namespace(){
    // toss no-namespace-warning
    return 'tahini.base';
    // reverse domain
  }

  static get initState(){
    // toss no-init-state-warning
    return {};
    // can return plainJS or immutable, but immutable is better for subclass-merging
    // baseReducer.setSubstate-> immutable.setIn( dataPath, ...initState... )
  }

  render(){
    // toss no-render-warning
    const { children, ...props } = this.props;

    // should test this prop passing, it is relied on in tests
    
    return createElement( 'div', {}, children );
    // ie just render the children
  }
}

export default Base;
