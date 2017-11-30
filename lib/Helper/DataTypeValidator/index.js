/**
 * Created by roten on 11/20/17.
 */

const fs = require('fs');
const path = require('path');
module.exports = (() => {
    "use strict";
    return fs.readdirSync(__dirname).filter(filePath => {
        let fileInfo = path.parse(filePath);
        return fileInfo.ext === '.js' && fileInfo.name.toLowerCase() !== 'index';
    })
        .reduce((dataChecker, logicFile) => {
            let fileInfo = path.parse(logicFile);
            dataChecker[fileInfo.name.toLowerCase()] = require(path.resolve(__dirname, logicFile));
            return dataChecker;
        }, {})
})()