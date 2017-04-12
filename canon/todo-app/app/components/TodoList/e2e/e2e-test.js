import { expect } from 'chai';
import { Builder } from 'selenium-webdriver';

const { driver }  = global;
global.testCount++;

import PO from './page-object';
const page = PO(driver);

describe('TodoList (route) e2e', function(){
  // e2e tests are too slow for default Mocha timeout apparently
  this.timeout(10000);

  before(function(done) {
    page.navigate().then(done);
  });

  it('adds a todo', function(done) {
    // get the list length
    let ilen;
    page.getTodoItems().then(todos=> ilen = todos.length);

    // add the todo
    page.typeText('woah!');
    page.clickAddButton();

    // get the list length again
    page.getTodoItems().then(todos=>{
      
      // expect the results to equal   
      expect(todos.length).to.equal(ilen + 1);
      
    }).then(done);
  });

  after(function(done) {
    if(!--global.testCount) driver.quit().then(done);
    else done();
  });
});

