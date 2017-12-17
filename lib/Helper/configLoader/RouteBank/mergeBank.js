/**
 * Created by roten on 11/17/17.
 */
'use strict';

const {InternalError} = require('../../../Error');
module.exports = (bank, JSONObject) => {
  const theURL = Object.keys(JSONObject)[0];
  Object.keys(JSONObject[theURL]).forEach((method) => {
    if (bank[theURL] === undefined) {
      bank[theURL] = {};
    }
    if (bank[theURL][method] !== undefined) {
      throw new InternalError().setDetails({
        message: 'a duplicate route find in route config',
        data: {
          bank: bank,
          duplicateURL: theURL,
          duplicateMethod: method,
        },
      });
    } else {
      bank[theURL][method] = JSONObject[theURL][method];
    }
  });

  return bank;
};
