/**
 * Created by roten on 11/17/17.
 */
const loadBlock = require('./loadBlock')
const mergeBank = require('./mergeBank');
const { InternalError} = require('../../../Error');
const jsonValidator = module.exports = (JSONObjects) => {
    if (Array.isArray(JSONObjects)) {
        return JSONObjects.map(jsonValidator).reduce(mergeBank, {});
    }
    else if (JSONObjects.URL !== undefined && JSONObjects.METHOD !== undefined &&
        (JSONObjects.SCRIPT !== undefined || JSONObjects.BODY !== undefined)) {
        // it's a block
        return loadBlock(JSONObjects);
    }
    else {
        return Object.keys(JSONObjects)
            .reduce((p, JSONObject) => {
                "use strict";
                if (Array.isArray(JSONObjects[JSONObject])) {
                    // load array one by one
                    let processedArray = jsonValidator(JSONObjects[JSONObject]);
                    return Object.keys(processedArray)
                        .reduce((p, key) => {
                            let tmp = {}
                            tmp[key] = processedArray[key];
                            return mergeBank(p, tmp);
                        }, p);

                }
                else if (JSONObjects[JSONObject].URL !== undefined && JSONObjects[JSONObject].METHOD !== undefined &&
                    (JSONObjects[JSONObject].SCRIPT !== undefined || JSONObjects[JSONObject].BODY !== undefined)) {
                    // it's a block
                    return mergeBank(p, loadBlock(JSONObjects[JSONObject]))
                }
                else {
                    // it's not good param config
                    throw new InternalError().setDetails({
                        message: "Param config is not valid ",
                        data: {
                            happenOn: JSON.stringify(JSONObjects[JSONObject])
                        }
                    });
                }
            }, {})
    }

}