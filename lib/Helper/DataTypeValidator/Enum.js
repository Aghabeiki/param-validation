'use strict';
const {InternalError} = require('../../Error/index');
module.exports = function(paramConfig, paramValue) {
  const res = {};
  res.requiredDataType = paramConfig.type;
  const values = paramConfig.values;
  res.dataFormatPass = true;
  res.dataTypePassed = Array.isArray(values);
  res.status = false;
  if (res.dataTypePassed) {
    res.status = values.indexOf(paramValue) !== -1;
  } else {
    throw new InternalError().setDetails({
      message: 'Invalid Enum configuration.',
      data: {
        message: 'Missed or invalid value in config.',
        details: values,
      },
    });
  }

  return res;
};
