/**
 * Created by roten on 11/20/17.
 */
'use strict';

const PVError = require('./PVError');

/**
 * @desc Error for missed param.
 */
class RequiredParamNotFound extends PVError {
  /**
   *
   */
  constructor() {
    super('A required param missed in your request.');
  }
}
module.exports = RequiredParamNotFound;
