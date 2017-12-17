/**
 * Created by roten on 11/17/17.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const mergeBank = require('./mergeBank');
const jsonValidator = require('./JSONValidator');

module.exports = function(basePath) {
  return require('fs').readdirSync(basePath).filter((file) => {
    return path.extname(file).toLowerCase() === '.json';
  })
    .map((file) => {
      return jsonValidator(JSON.parse(fs.readFileSync(path.join(basePath, file)).toString()));
    })
    .reduce((bank, bankParts) => {
      return Object.keys(bankParts).reduce((p, key) => {
        const tmp = {};
        tmp[key] = bankParts[key];
        return mergeBank(p, tmp);
      }, bank);
    }, {});
};
