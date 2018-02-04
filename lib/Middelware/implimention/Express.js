/**
 * Created by roten on 11/17/17.
 */
'use strict';

const BaseMiddleware = require('../BaseMiddelware');
const getRoutes = require('get-routes');
const {InternalError} = require('../../Error');

/**
 * @description A Express.js friendly Param Validator Middleware implementation.
 * @todo Implement this parts.
 */
class Express extends BaseMiddleware {
  /**
   * loadAppRouteConfig
   *  @description overwriten loadAppRouteConfig to match Sails for loading getRouter
   * @param {Object} app Sails App.
   * @return {JSON} json paramValidator Middleware config.;
   */
  loadAppRouteConfig(app) {
    let results=null;
    try {
      results=getRoutes(app);
    } catch (err) {
      new InternalError().setDetails({
        message: err.message,
        data: err,
      });
    }
    return results;
  }
}

module.exports = Express;
