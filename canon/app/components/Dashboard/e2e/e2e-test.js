import { expect } from 'chai';
import { Builder } from 'selenium-webdriver';

const { driver }  = global;
global.testCount++;

import PO from './page-object';
const page = PO(driver);

describe('Dashboard (route) e2e', function(){
  this.timeout(10000);

  before(function(done) {
    page.navigate().then(done);
  });

  it('activates a device', function(done) {

    page.getDevices().then(devices=>
      
      page.activateDevice(devices[0])
	  .then(page.getActiveDevice)
	  .then(activeDevice=>
	    Promise.all([
	      activeDevice.getId(),
	      devices[0].getId()
	    ]))
	  .then(ids=> expect(ids[0]).to.equal(ids[1]))
      
    ).then(()=> done());
  });

  after(function(done) {
    if(!--global.testCount) driver.quit().then(done);
    else done();
  });
});
