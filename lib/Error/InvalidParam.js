'use strict';

const PVError=require('./PVError');

/**
 * @desc general Invalid params
 */
class InvalidParam extends PVError {
  /**
   *
   * @param {string}title
   * @param {string|{message:string,data:object}}args
   */
  constructor(title, args) {
    super(`Invalid parameter(s), ${title||''}`);
    if (args) super.setDetails(args);
  }
}
module.exports=InvalidParam;
