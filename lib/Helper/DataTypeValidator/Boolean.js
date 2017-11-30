/**
 * Created by roten on 11/20/17.
 */

module.exports = (paramConfig, paramValue) => {
    "use strict";
    let res = {};
    try {
        res.requiredDataType = paramConfig.type;
        if (paramConfig['null-allowed'] && paramValue === null) {
            res.dataFormatPass = true;
            res.dataTypePassed = true;
        }
        else {

            res.dataTypePassed = typeof paramValue === 'boolean';

        }
        res.status = res.dataTypePassed;
    }
    catch (e) {
        res.message = e.message;
        res.dataTypePassed = false;
        res.status = false;
    }
    return res;
};