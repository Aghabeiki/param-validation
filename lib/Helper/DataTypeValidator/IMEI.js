'use strict';

const imei = require('imei');
module.exports = function(paramConfig, paramValue) {
  const res = {};
  res.requiredDataType = paramConfig.type;
  res.dataTypePassed = typeof paramValue === 'string';
  try {
    res.dataFormatPass = imei.isValid(paramValue);
  } catch (err) {
    res.dataFormatPass = false;
  }

  res.status = res.dataTypePassed && res.dataFormatPass;
  return res;
};
