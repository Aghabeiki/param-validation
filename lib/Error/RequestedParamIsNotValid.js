/**
 * Created by roten on 11/20/17.
 */
'use strict';

const PVError = require('./PVError');

/**
 * @desc param is not valid.
 */
class RequestedParamIsNotValid extends PVError {
  /**
   *
   * @param {string|{message:string,data:object}}args
   */
  constructor(args) {
    super('Requested param is not valid.');
    if (args) super.setDetails(args);
  }
}

module.exports = RequestedParamIsNotValid;
