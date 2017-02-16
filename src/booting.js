import {
  bootAppWithRoutes
} from './routing';

import {
  connectDeviceFactory
} from './devices';

import {
  bootStores
} from './stores';

export const bootApp = (middleware, routes)=>{

  // test this with vanilla components for routeViews

  // take just a list of routeComponents? sensibly default the rest
  
  return bootAppWithRoutes( connectDeviceFactory( bootStores(middleware) ), routes );
};
