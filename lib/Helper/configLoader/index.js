/**
 * Created by roten on 11/17/17.
 */
'use strict';

const {InternalError} = require('../../Error');
const fs = require('fs');
const path = require('path');
/**
 *
 * @param {JSON} config
 */

const checkModuleConfig = (config) => {
  // check projectBaseDIR

  let out = true;
  if (config === undefined || config === null) {
    out = false;
  } else if (config.projectBaseDIR === undefined || !fs.existsSync(config.projectBaseDIR)) {
    out = false;
  } else if (config.routeConfig === undefined ||
    !fs.existsSync(path.resolve(config.projectBaseDIR, config.routeConfig))) {
    // check routeConfig
    out = false;
  } else if (config.scriptValidatorPath === undefined ||
    !fs.existsSync(path.resolve(config.projectBaseDIR, config.scriptValidatorPath))) {
    // check scriptValidatorPath
    out = false;
  } else if (config.excludePrefix === undefined) {
    // check excludePrefix
    out = false;
  }
  return out;
};
module.exports = function(config) {
  // validate config
  const moduleConfigIsNotValid = checkModuleConfig(config);
  if (!moduleConfigIsNotValid) {
    throw new InternalError().setDetails({
      message: 'Param Validator configuration is not correct',
      data: {
        moduleConfigIsNotValid: moduleConfigIsNotValid,
        config: config,
      },
    });
  } else {
    // generate the config
    const moduleConfig = {
      excludePrefix: config.excludePrefix,
      scriptPath: path.resolve(config.projectBaseDIR, config.scriptValidatorPath),
    };
    return {
      // load route config
      routeConfig: require('./RouteBank')(path.resolve(config.projectBaseDIR, config.routeConfig)),
      moduleConfig: moduleConfig,
    };
  }
};
