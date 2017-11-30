/**
 * Created by roten on 11/17/17.
 */
const fs = require('fs');
const path = require('path');
const mergeBank = require('./mergeBank');
const jsonValidator = require('./JSONValidator');

module.exports = function (basePath) {
    return require('fs').readdirSync(basePath).filter(file => {
        "use strict";
        return path.extname(file).toLowerCase() === '.json'
    })
        .map(file => {
            "use strict";
            return jsonValidator(JSON.parse(fs.readFileSync(path.join(basePath, file)).toString()))
        })
        .reduce((bank, bankParts) => {
            "use strict";
            return Object.keys(bankParts).reduce((p, key) => {
                let tmp = {};
                tmp[key] = bankParts[key];
                return mergeBank(p, tmp);
            }, bank);
        }, {})
}
