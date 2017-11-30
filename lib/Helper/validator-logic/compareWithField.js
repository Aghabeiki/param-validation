const {InternalError} = require('../../Error/index');
module.exports = function (pairs) {
    "use strict";
    let finalRes = true;
    for (let i = 0; i < pairs.targets.length; i++) {

        let pair = pairs.targets[i]
        if (pairs.me.config.type !== pair.target.config.type) {
            finalRes = false;
            break;
        }
        else {
            switch (pair.cmd) {
                case ">":
                    finalRes = pairs.me.value > pair.target.value;
                    break;
                case ">=":
                    finalRes = pairs.me.value >= pair.target.value;
                    break;
                case "<":
                    finalRes = pairs.me.value < pair.target.value;
                    break;
                case "<=":
                    finalRes = pairs.me.value <= pair.target.value;
                    break;
                case "==":
                case "===":
                    finalRes = pairs.me.value === pair.target.value;
                    break;
                case "!=":
                case "!==":
                    finalRes = pairs.me.value !== pair.target.value;
                    break;
                default:
                    throw new InternalError().setDetails({
                        message: "Validator bank configuration is invalid for compareWithOtherParam.",
                        data: {
                            pairs: pairs
                        }
                    });
            }
        }
    }
    return finalRes;
}