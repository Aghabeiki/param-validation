/**
 * Created by roten on 11/20/17.
 */
'use strict';

const regexParamValidator = require('../validator-logic/regexParamValidator');
module.exports = function(paramConfig, paramValue) {
  const res = {};
  res.requiredDataType = paramConfig.type;
  if (paramConfig['null-allowed'] && paramValue === null) {
    res.dataFormatPass = true;
    res.dataTypePassed = typeof paramValue === 'string';
  } else {
    res.dataTypePassed = typeof paramValue === 'string';
    res.dataFormatPass = regexParamValidator(paramConfig, paramValue);
  }
  res.status = res.dataTypePassed && res.dataFormatPass;
  if (paramConfig.minLength !== undefined) {
    res.minLengthAllowed = paramConfig.minLength;
    res.minLengthPassed = paramValue.toString().length >= paramConfig.minLength;
    res.status = res.status && res.minLengthPassed;
  }
  if (paramConfig.maxLength !== undefined) {
    res.maxLengthAllowed = paramConfig.maxLength;
    res.maxLengthPassed = paramValue.toString().length <= paramConfig.maxLength;
    res.status = res.status && res.maxLengthPassed;
  }
  if (paramConfig.length !== undefined) {
    res.lengthAllowed = paramConfig.length;
    res.lengthPassed = paramValue.toString().length === paramConfig.length;
    res.status = res.status && res.lengthPassed;
  }
  return res;
};
