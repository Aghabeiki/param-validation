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
   */
  constructor() {
    super('Requested param is not valid');
  }
}

module.exports = RequestedParamIsNotValid;
