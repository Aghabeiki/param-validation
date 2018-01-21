'use strict';

const PVError = require('./PVError');

/**
 * @desc Any kind of internal error should throw this error type.
 */
class InternalError extends PVError {
  /**
   *
   * @param {string|{message:string,data:object}}args
   */
  constructor(args) {
    super('Internal Error.');
    if (args) super.setDetails(args);
  }
}

module.exports = InternalError;
