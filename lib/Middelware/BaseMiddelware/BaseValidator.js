/**
 * Created by roten on 11/20/17.
 */
const Context = require('./Context/index');
const ConfigLoader = require('../../Helper/index').ConfigLoader;
// private properties;
let _context = null;
const {PVError,InternalError} = require('../../Error/index');
const RequiredParamNotFound = require('../../Error/index').RequiredParamNotFound;
const RequestedParamIsNotValid = require('../../Error/index').RequestedParamIsNotValid;
let BaseValidatorPrivate = require('./BaseValidatorPrivateZone');

class BaseValidator {
    constructor(app, config) {
        const appRoutes = this.loadAppRouteConfig(app) || {};
        const {routeConfig, moduleConfig} = ConfigLoader(config);
        _context = new Context(appRoutes, routeConfig, moduleConfig);

    }

    get private() {
        return BaseValidatorPrivate;
    }

    get context() {
        return _context;
    }

    set context(value) {
        _context = value;
    }

    /**
     * @description Find the correct rule for the request.
     * @param url
     * @param method
     * @returns {{}}
     */
    findRule(key, method) {
        if (key && method) {
            const rule = this.context.routeConfig[key.toLowerCase()][method.toLowerCase()];
            if (!rule) {
                throw new InternalError().setDetails({
                    message: "In findRule function,the passed key and method are not valid.",
                    data: {
                        key: key,
                        method: method
                    }
                })
            }
            return rule;
        }
        else {
            throw new InternalError()
                .setDetails({
                    message: "In findRule function, key or method is/are not passed correctly.",
                    data: {
                        key: key,
                        method: method
                    }

                })
        }


    }

    /**
     *
     * @param rule
     * @param params
     */
    ruleExecutor(rule, params) {

        if (this.private.isScriptBase(rule)) {
            // Run script Validator on params.
            try {

                let scriptTargetPath = require('path').resolve(this.context.moduleConfig.scriptPath, rule.SCRIPT);
                if (!fs.existsSync(scriptTargetPath)) {
                    throw new InternalError().setDetails({
                        message: 'The script config is not correct.',
                        data: {script: rule}
                    })
                }
                let res = require(scriptTargetPath).validator(param);
                if (res) {
                    cb(null)
                }
                else {
                    throw  new InternalError()
                        .setDetails({
                            message: "Param validator, script base validation, invalid script.\nShould throw your error based on PVError",
                            data: {}
                        })
                }
            }
            catch (error) {
                if (error instanceof PVError) {
                    throw error;
                }
                else {
                    throw new InternalError().setDetails({
                        message: "Unhandled error happened in Script base param validator",
                        data: error
                    })
                }
            }
        }
        else {
            // Run internal Validator

            // check the required fields
            let matchRequireRes = this.private.matchRequirement(rule, params)
            if (matchRequireRes !== null) {
                let missedPath = "";
                matchRequireRes.forEach(pair => {
                    if (pair.missed) {
                        missedPath += (missedPath === '' ? '' : ",") + pair.path;
                    }
                });
                throw new RequiredParamNotFound().setDetails({
                    message: "Param not found but it required.",
                    data: {
                        missedPath: missedPath
                    }
                })
            }
            // check the fields data type
            let mathDataTypeRes = this.private.matchFieldsDataType(rule, params).filter(row => {
                "use strict";
                if (row[Object.keys(row)[0]].status !== undefined) {
                    return row[Object.keys(row)[0]].status === false;
                }
                else {
                    return true;
                }

            });
            if (mathDataTypeRes.length !== 0) {
                throw new RequestedParamIsNotValid()
                    .setDetails({
                        message: 'The listed param is not valid:',
                        data: mathDataTypeRes
                    });
            }

            // check the other fields param( like length enum and etc.. )

            return null;
        }

    }

}


module.exports = BaseValidator;