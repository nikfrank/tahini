import './with-css-modules';

import { Builder } from 'selenium-webdriver';

global.driver  = new Builder().forBrowser('chrome').build();

global.testCount = 0;
// this is a hacky? solution to running the tests one after another in the same browser window

// perhaps in a CI env the test are run parallel on selenium grid? (thus this not necc)
