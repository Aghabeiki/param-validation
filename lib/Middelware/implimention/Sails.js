/**
 * Created by roten on 11/17/17.
 */
'use strict';

const BaseMiddleware = require('../BaseMiddelware');
const getRoutes = require('get-routes');
const {InternalError} = require('../../Error');

/**
 * @description A Sails.js friendly Param Validator Middleware implementation.
 */
class Sails extends BaseMiddleware {
  /**
   * loadAppRouteConfig
   *  @description overwriten loadAppRouteConfig to match Sails for loading getRouter
   * @param {Object} app Sails App.
   * @return {JSON} json paramValidator Middleware config.;
   */
  loadAppRouteConfig(app) {
    let results=null;
    if (app.constructor.name === 'Sails' && app.config.routes !== undefined) {
      try {
        results=getRoutes(app);
      } catch (err) {
        new InternalError().setDetails({
          message: err.message,
          data: err,
        });
      }
      return results;
    } else {
      throw new InternalError().setDetails({message: 'The passed app is not sails.', data: app});
    }
  }
}

module.exports = Sails;
