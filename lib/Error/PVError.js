/**
 * Created by roten on 11/17/17.
 */
'use strict';

let Handler = null;
const _details = new WeakMap();

/**
 * @desc Base Param Validator Error.
 */
class PVError extends Error {
  /**
   *
   * @param {array} args any number of args can send to it.
   */
  constructor(...args) {
    if (args === undefined || (Array.isArray(args) && !args.length)) {
      super();
    } else {
      super(args);
    }
    Handler = this;
    _details.set(Handler, null);
  }

  /**
   * @desc more details about the Error.
   * @param {{message: string,data:json}|string} errorDetails
   * @return {PVError}
   */
  setDetails(errorDetails) {
    if (typeof errorDetails ==='string') {
      _details.set(Handler, {
        message: errorDetails,
        data: {},
      });
    } else {
      if (!errorDetails.message ) {
        throw new Error('invalid usage of PVError');
      } else {
        if (!errorDetails.data) {
          errorDetails.data={};
        }
        _details.set(Handler, errorDetails);
      }
      return this;
    }
  }

  /**
   *
   * @return {{message:string,data:json}} error details.
   */
  getDetails() {
    return _details.get(Handler);
  }
}

module.exports = PVError;
