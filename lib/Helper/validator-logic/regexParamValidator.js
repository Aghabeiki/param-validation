const {InternalError} = require('../../Error/index');
module.exports = function (paramConfig, paramValue) {
    "use strict";
    if (paramConfig.regex64 === undefined)
        return true;
    let regex = null;
    try {
        regex = new RegExp(Buffer.from(paramConfig.regex64, 'base64').toString());
    }
    catch (e) {
        throw new InternalError().setDetails({
            message:"Invalid validator configuration, please check your regex format.",
            data:{
                regex:regex,
                encodedRegex:paramConfig.regex64
            }
        });
    }
    if (regex) {
        return regex.test(paramValue)
    }

}