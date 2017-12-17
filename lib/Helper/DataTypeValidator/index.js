/**
 * Created by roten on 11/20/17.
 */
'use strict';

const fs = require('fs');
const path = require('path');
module.exports = (() => {
  return fs.readdirSync(__dirname).filter((filePath) => {
    const fileInfo = path.parse(filePath);
    return fileInfo.ext === '.js' && fileInfo.name.toLowerCase() !== 'index';
  })
    .reduce((dataChecker, logicFile) => {
      const fileInfo = path.parse(logicFile);
      dataChecker[fileInfo.name.toLowerCase()] = require(path.resolve(__dirname, logicFile));
      return dataChecker;
    }, {});
})();
