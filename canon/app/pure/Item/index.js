import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import styles from './index.css';

class Item extends Component {
  constructor(props){
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  
  render() {
    return (
      <div className={styles.todo}>
	{this.props.todo.get('text')}
      </div>
    );
  }
}

export { Item };
