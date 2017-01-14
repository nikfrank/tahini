import { expect } from 'chai';
import { fromJS } from 'immutable';


import React from 'react';
import { mount } from 'enzyme';

import { Item } from './';
import styles from './index.css';

describe('TodoList Item as a Component sub-class', ()=>{
  it('renders a todo as expected', ()=>{

    const testProps = {text:'test-todo'};
    const testTodo = React.createElement(Item, {todo:fromJS(testProps)});

    const el = mount(testTodo);

    expect(el.find('.'+styles.todo)).to.have.length(1);
    expect(el.find('div')).to.have.length(1);
    expect(el.html()).to.contain(testProps.text);
  });
});
