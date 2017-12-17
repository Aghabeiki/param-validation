'use strict';

const PVError = require('./PVError');

/**
 * @desc Any kind of internal error should throw this error type.
 */
class InternalError extends PVError {
  /**
   *
   */
  constructor() {
    super('Internal Error.');
  }
}

module.exports = InternalError;
