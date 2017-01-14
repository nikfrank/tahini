'use strict';

var devices = require('./dist/devices');
var util = require('./dist/util');
var Base = require('./dist/base-class').default;

var networkMiddleware = require('./dist/network-middleware').default;
var networkHandlers = require('./dist/network-handlers').default;

module.exports = {
  Base: Base,
  networkMiddleware: networkMiddleware,
  networkHandlers: networkHandlers,
  bootApp: devices.bootApp,
  consumeActionByNamespace: util.consumeActionByNamespace,
  isolateMutationByDataPath: util.isolateMutationByDataPath,
  baseReducerHash: devices.baseReducerHash,
  applyPartialAction: util.applyPartialAction,
  connectToLexicalScope: devices.connectToLexicalScope
};
