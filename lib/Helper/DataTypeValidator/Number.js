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
    res.dataTypePassed = true;
  } else {
    res.dataFormatPass = regexParamValidator(paramConfig, paramValue.toString());
    res.dataTypePassed = typeof paramValue === 'number';
  }
  res.status = res.dataTypePassed && res.dataFormatPass;
  if (paramConfig.min !== undefined) {
    res.minValueAllowed = paramConfig.min;
    res.minValuePassed = paramValue >= paramConfig.min;
    res.status = res.status && res.minValuePassed;
  }
  if (paramConfig.max !== undefined) {
    res.maxValueAllowed = paramConfig.max;
    res.maxValuePassed = paramValue <= paramConfig.max;
    res.status = res.status && res.maxValuePassed;
  }
  return res;
};
