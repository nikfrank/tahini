import {
  connectDeviceFactory
} from './devices';

import {
  bootStores
} from './stores';

export const bootApp = (middleware)=>
  ( connectDeviceFactory( bootStores(middleware) ) );
