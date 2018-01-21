/**
 * Created by roten on 11/17/17.
 */
'use strict';

const {InternalError} = require('../../Error/index');

/**
 * @description Abstract ParamValidator Middleware.
 */
class BaseInterface {
  /**
   * @desc this function call for each implemented app to load all app route config.
   * @interface
   * @todo should replace with get-routes module.
   * @param {T} app target web app.
   */
  loadAppRouteConfig(app) {
    throw new InternalError().setDetails({
      message: '`loadAppConfig` not implemented.',
      data: {},
    });
  }

  /**
   * @desc Base middleware for each web app target that should run for param validation.
   * @interface
   * @param {Array} args
   */
  validator(...args) {
    throw new InternalError().setDetails({
      message: '`validator-logic` not implemented.',
      data: {},
    });
  }

  /**
   * @desc Should implement to fetch params, url and method for each web app.
   * @interface
   * @param {object} req a valid web request.
   */
  requestParser(req) {
    throw new InternalError().setDetails({
      message: '`requestParser` not implemented.',
      data: {},
    });
  }
}

module.exports = BaseInterface;
