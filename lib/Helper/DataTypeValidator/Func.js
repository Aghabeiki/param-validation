'use strict';
const _ = require('lodash');
const {InternalError} = require('../../Error/index');
module.exports = function(paramConfig, paramValue) {
  const res = {};
  res.requiredDataType = paramConfig.type;
  const fn = paramConfig.functionBody;
  res.dataFormatPass = true;
  res.dataTypePassed = _.isFunction(fn);
  res.status = false;
  if (res.dataTypePassed) {
    try {
      res.status = fn(paramValue);
    } catch (err) {
      throw new InternalError().setDetails({
        message: 'An error happened on running function.',
        data: {
          err: err.message,
          stack: err.stack.split('\n'),
        },
      });
    }
  }

  return res;
};
