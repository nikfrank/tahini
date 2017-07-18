'use strict';

var Base = require('./dist/base-class').default;
var util = require('./dist/util');
var devices = require('./dist/devices');
var stores = require('./dist/stores');
var booting = require('./dist/booting');

var networkMiddleware = require('./dist/network-middleware').default;
var networkHandlers = require('./dist/network-handlers').default;

var simpleHTTP = require('./dist/network-handlers/simpleHTTP').default;

module.exports = {
  Base: Base,
  networkMiddleware: networkMiddleware,
  networkHandlers: networkHandlers,

  simpleHTTP: simpleHTTP,

  consumeActionByNamespace: util.consumeActionByNamespace,
  isolateMutationByDataPath: util.isolateMutationByDataPath,
  applyPartialAction: util.applyPartialAction,

  getNextState: util.getNextState,
  toJS: util.toJS,
  rejectify: util.rejectify,
  
  bootStores: stores.bootStores,
  baseReducerHash: stores.baseReducerHash,

  connectToLexicalScope: devices.connectToLexicalScope,
  connectDeviceFactory: devices.connectDeviceFactory,

  bootApp: booting.bootApp,
};
