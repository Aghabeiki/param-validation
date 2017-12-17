/**
 * Created by roten on 11/20/17.
 */
'use strict';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const regexParamValidator = require('../validator-logic/regexParamValidator');

module.exports = function(paramConfig, paramValue) {
  const res = {};
  res.requiredDataType = paramConfig.type;
  if (paramConfig['null-allowed'] && paramValue === null) {
    res.dataFormatPass = true;
    res.dataTypePassed = true;
  } else {
    try {
      res.dataTypePassed = typeof paramValue === 'string' && phoneUtil.isValidNumber(phoneUtil.parse(paramValue));
    } catch (e) {
      res.message = e.message;
      res.dataTypePassed = false;
    } finally {
      res.dataFormatPass = regexParamValidator(paramConfig, paramValue);
    }
  }
  res.status = res.dataTypePassed && res.dataFormatPass;
  res.status = res.dataTypePassed;
  return res;
};
