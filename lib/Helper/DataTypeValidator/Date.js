/**
 * Created by roten on 11/20/17.
 */
const regexParamValidator = require('../validator-logic/regexParamValidator');
module.exports = (paramConfig, paramValue) => {
    "use strict";
    let res = {};
    res.requiredDataType = paramConfig.type;
    if (paramConfig['null-allowed'] && paramValue === null) {
        res.dataTypePassed = true;
        res.dataFormatPass = true;
    }
    else {
        res.dataTypePassed = isNaN(Date.parse(paramValue)) ? false : true;
        res.dataFormatPass = regexParamValidator(paramConfig, paramValue)
    }
    res.status = res.dataTypePassed && res.dataFormatPass;
    return res;
}