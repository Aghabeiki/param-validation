/**
 * Created by roten on 11/20/17.
 */
'use strict';

const Context = require('./Context/index');
const ConfigLoader = require('../../Helper/index').ConfigLoader;
// private properties;
let _context = null;
const {PVError, InternalError} = require('../../Error/index');
const RequiredParamNotFound = require('../../Error/index').RequiredParamNotFound;
const RequestedParamIsNotValid = require('../../Error/index').RequestedParamIsNotValid;
const BaseValidatorPrivate = require('./BaseValidatorPrivateZone');
const fs = require('fs');

/**
 * @description Abstract Middleware Validator Implementation.
 */
class BaseValidator {
  /**
   *
   * @param {T} app Target web app.
   * @param {JSON} config Param Validator config.
   */
  constructor(app, config) {
    const appRoutes = this.loadAppRouteConfig(app) || {};
    const {routeConfig, moduleConfig} = new ConfigLoader(config);
    _context = new Context(appRoutes, routeConfig, moduleConfig);
  }

  /**
   * @desc Get access to private methods.
   * @return {BaseValidatorPrivate}
   */
   get private() {
    return BaseValidatorPrivate;
  }

  /**
   * @desc Get access to app context.
   * @return {context}
   */
   get context() {
    return _context;
  }

  /**
   * @param {context} value
   */
   set context(value) {
    _context = value;
  }

  /**
   * @description Find the correct rule for the request.
   * @param {string} key
   * @param {string} method
   * @return {*}
   */
  findRule(key, method) {
    if (key && method) {
      const rule = this.context.routeConfig[key.toLowerCase()][method.toLowerCase()];
      if (!rule) {
        throw new InternalError().setDetails({
          message: 'In findRule function,the passed key and method are not valid.',
          data: {
            key: key,
            method: method,
          },
        });
      }
      return rule;
    } else {
      throw new InternalError()
        .setDetails({
          message: 'In findRule function, key or method is/are not passed correctly.',
          data: {
            key: key,
            method: method,
          },

        });
    }
  }

  /**
   * @desc Execute rule on a param sets.
   * @param {Object } rule A param validator rule.
   * @param {JSON} params a json object that contain the requested params.
   * @throws {PVError} an extended error based PVError. if any problem find in the params.
   * @return {null/true}
   */
  ruleExecutor(rule, params) {
    if (this.private.isScriptBase(rule)) {
      // Run script Validator on params.
      try {
        const scriptTargetPath = require('path').resolve(this.context.moduleConfig.scriptPath, rule.SCRIPT);
        if (!fs.existsSync(scriptTargetPath)) {
          throw new InternalError().setDetails({
            message: 'The script config is not correct.',
            data: {script: rule},
          });
        }
        const res = require(scriptTargetPath).validator(params);
        if (res) {
          return null;
        } else {
          throw new InternalError()
            .setDetails({
              message: 'Param validator, script base validation, invalid script.\n' +
              'Should throw your error based on PVError',
              data: {},
            });
        }
      } catch (error) {
        if (error instanceof PVError) {
          throw error;
        } else {
          throw new InternalError().setDetails({
            message: 'Unhandled error happened in Script base param validator',
            data: error,
          });
        }
      }
    } else {
      // Run internal Validator

      // check the required fields
      const matchRequireRes = this.private.matchRequirement(rule, params);
      if (matchRequireRes !== null) {
        let missedPath = '';
        matchRequireRes.forEach((pair) => {
          if (pair.missed) {
            missedPath += (missedPath === '' ? '' : ',') + pair.path;
          }
        });
        throw new RequiredParamNotFound().setDetails({
          message: 'Param not found but it required.',
          data: {
            missedPath: missedPath,
          },
        });
      }
      // check the fields data type
      const mathDataTypeRes = this.private.matchFieldsDataType(rule, params).filter((row) => {
        if (row[Object.keys(row)[0]].status !== undefined) {
          return row[Object.keys(row)[0]].status === false;
        } else {
          return true;
        }
      });
      if (mathDataTypeRes.length !== 0) {
        throw new RequestedParamIsNotValid()
          .setDetails({
            message: 'The listed param is not valid:',
            data: mathDataTypeRes,
          });
      }

      // check the other fields param( like length enum and etc.. )

      return null;
    }
  }

  /**
   * @desc Basic param validator middleware.
   * @param {object} req
   * @param {object} res
   * @param {method}next
   * @return {*}
   */
  validator(req, res, next) {
    let error = null;
    try {
      // Check if the URL is excluded from param validator-logic skipp it.
      if (this.context.moduleConfig.excludePrefix !== null) {
        const rg = new RegExp(this.context.moduleConfig.excludePrefix, 'i');

        if (rg.test(req.url.toLowerCase())) {
          return next();
        }
      }

      // Get request information.
      const reqInfo = this.requestParser(req);

      const rule = this.findRule(reqInfo.ruleKey, reqInfo.method);

      // Run the rule on params.

      /**
       * We have 4 parts to check .
       * - Body params.
       * - Header params.
       * - In Path params.
       * - Query String params.
       */

      // Check the body params.
      if (rule.BODY) {
        try {
          this.ruleExecutor(rule.BODY, reqInfo.params.body);
        } catch (error) {
          if (error instanceof PVError) {
            throw error;
          } else {
            throw new InternalError()
              .setDetails({
                message: error.message,
                data: error,
              });
          }
        }
      }
      // Check the Header params.
      if (rule.HEADER) {
        try {
          this.ruleExecutor(rule.HEADER, reqInfo.params.path);
        } catch (error) {
          if (error instanceof PVError) {
            throw error;
          } else {
            throw new InternalError()
              .setDetails({
                message: error.message,
                data: error,
              });
          }
        }
      }
      // Check the in Path params.
      if (rule.InPath) {
        try {
          this.ruleExecutor(rule.InPath, reqInfo.params.path);
        } catch (error) {
          if (error instanceof PVError) {
            throw error;
          } else {
            throw new InternalError()
              .setDetails({
                message: error.message,
                data: error,
              });
          }
        }
      }
      // Check the query string params.
      if (rule.QueryParam) {
        try {
          this.ruleExecutor(rule.QueryParam, reqInfo.params.queryString);
        } catch (error) {
          if (error instanceof PVError) {
            throw error;
          } else {
            throw new InternalError()
              .setDetails({
                message: error.message,
                data: error,
              });
          }
        }
      }
    } catch (err) {
      if (err instanceof PVError) {
        error = err;
      } else {
        error = new InternalError()
          .setDetails({
            message: err.message,
            data: err,
          });
      }
    } finally {
      if (!error) {
        // Param validation passed.
        next();
      } else {
        res.status(400).json({error_code: 0, error_message: error.message, error_details: error.getDetails()});
      }
    }
  }
}

module.exports = BaseValidator;
