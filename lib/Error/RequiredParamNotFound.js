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
   * @param {string|{message:string,data:object}} args
   */
  constructor(args) {
    super('A required param missed in your request.');
    if (args) super.setDetails(args);
  }
}
module.exports = RequiredParamNotFound;
