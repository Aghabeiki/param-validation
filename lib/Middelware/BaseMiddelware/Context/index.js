/**
 * Created by roten on 11/17/17.
 */
'use strict';

let _contextHandler = null;
// private properties;
const _appRoutes = new WeakMap();
const _routeConfig = new WeakMap();
const moduleConfig = new WeakMap();

/**
 * Context
 * @description used to hold ParamValidator Context and should use for all Implemented Middleware.
 */
class Context {
  /**
   * constructor
   *
   * @param {JSON} appRoutes
   * @param {JSON} routeConfig
   * @param {JSON} moduleConfig
   */
  constructor(appRoutes, routeConfig, moduleConfig) {
    _contextHandler = this;
    _contextHandler.appRoutes = appRoutes;
    _contextHandler.routeConfig = routeConfig;
    _contextHandler.moduleConfig = moduleConfig;
  }

  /**
   * @return {JSON}
   */
  static get appRoutes() {
    return _appRoutes.get(_contextHandler);
  }

  /**
   * @param {JSON} value
   */
  static set appRoutes(value) {
    _appRoutes.set(_contextHandler, value);
  }

  /**
   *
   * @return {JSON}
   */
  static get routeConfig() {
    return _routeConfig.get(_contextHandler);
  }

  /**
   *
   * @param {JSON} value
   */
  static set routeConfig(value) {
    _routeConfig.set(_contextHandler, value);
  }

  /**
   *
   * @return {JSON}
   */
  static get moduleConfig() {
    return moduleConfig.get(_contextHandler);
  }

  /**
   *
   * @param {JSON} value
   */
  static set moduleConfig(value) {
    moduleConfig.set(_contextHandler, value);
  }
}
module.exports = Context;
