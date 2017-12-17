/**
 * Created by roten on 11/20/17.
 */
'use strict';

const _ = require('lodash');
const validator = require('../../Helper').validatorLogic;
const DataTypeValidator = require('../../Helper').DataTypeValidator;
const {InternalError} = require('../../Error');
const privateZone = module.exports = {
  isScriptBase: (rule) => {
    return rule.SCRIPT !== undefined && rule.SCRIPT !== '' && rule.SCRIPT !== null;
  },
  matchRequirement: (target, param) => {
    // load all the path
    const errorStack = [];
    const allPath = privateZone.getAllPath(target);
    allPath.required.forEach((path) => {
      let pathIsValid = true;
      let paramTmp = _.cloneDeep(param);
      const keyPath = path.split('.');
      for (let i = 0; i < keyPath.length && pathIsValid; i++) {
        if (paramTmp[keyPath[i]] === undefined) {
          pathIsValid = false;
        } else {
          paramTmp = _.cloneDeep(paramTmp[keyPath[i]]);
        }
      }
      if (pathIsValid === false) {
        errorStack.push({path: path, missed: true});
      }
    });
    if (errorStack.length !== 0) {
      return errorStack;
    } else {
      return null;
    }
  },
  matchFieldsDataType: (target, param) => {
    const that = privateZone;
    const allPath = that.getAllPath(target);
    let res = [];
    const allParamPath = [];
    allPath.required.forEach((path) => {
      const pass = {};
      pass[path] = {};

      const paramConfig = that.getParamConfig(target, path);
      const paramValue = that.getParamVal(param, path);
      if (paramConfig.type.split('|').length > 1) {
        // should work on two or more way !
        const tmpType = paramConfig.type.split('|');

        const totalRes = [];
        tmpType.forEach((type) => {
          const tmp = _.cloneDeep(paramConfig);
          tmp.type = type;
          totalRes.push(that.paramConfigChecker(tmp, paramValue));
        });
        const myRes = totalRes.filter((res) => {
          return res.status === true;
        });
        if (myRes.length === 1) {
          pass[path] = myRes[0];
        } else if (myRes.length === 0) {
          const myRes = {};
          let index = 0;
          totalRes.forEach((res) => {
            myRes[tmpType[index]] = res;
            index++;
          });
          // mean nothing match
          pass[path] = myRes;
        } else if (myRes.length > 1) {
          // more then one match ! not possible :D
          throw new InternalError().setDetails({
            message: 'Something interesting happened two data type is valid in the same time :D ',
            data: {},
          });
        }
      } else {
        pass[path] = that.paramConfigChecker(paramConfig, paramValue);
      }

      {
        allParamPath.push({name: path, config: paramConfig, value: paramValue});
      }
      res.push(pass);
    });
    allPath.notRequired.forEach((path) => {
      const pass = {};
      pass[path] = {};

      const paramConfig = that.getParamConfig(target, path);
      const paramValue = that.getParamVal(param, path);
      if (paramValue !== undefined) {
        if (paramConfig.type.split('|').length > 1) {
          // should work on two or more way !
          const tmpType = paramConfig.type.split('|');

          const totalRes = [];
          tmpType.forEach((type) => {
            const tmp = _.cloneDeep(paramConfig);
            tmp.type = type;
            totalRes.push(that.paramConfigChecker(tmp, paramValue));
          });
          const myRes = totalRes.filter((res) => {
            return res.status === true;
          });
          if (myRes.length === 1) {
            pass[path] = myRes[0];
          } else if (myRes.length === 0) {
            const myRes = {};
            let index = 0;
            totalRes.forEach((res) => {
              myRes[tmpType[index]] = res;
              index++;
            });
            // mean nothing match
            pass[path] = myRes;
          } else if (myRes.length > 1) {
            // more then one match ! not possible :D
            throw new InternalError().setDetails({
              message: 'Something interesting happened two data type is valid in the same time :D ',
              data: {},
            });
          }
        } else {
          pass[path] = that.paramConfigChecker(paramConfig, paramValue);
        }
        {
          allParamPath.push({name: path, config: paramConfig, value: paramValue});
        }
        res.push(pass);
      }
    });
    allParamPath.filter((param) => {
      return Array.isArray(param.config.compareWithFiled);
    }).reduce((p, v) => {
      const requireParamName = v.config.compareWithFiled.map((elem) => {
        const cmd = elem.split(':')[0];
        let paramName = elem.split(':')[1];
        if (cmd === undefined || paramName === undefined) {
          throw new InternalError().setDetails({
            message: 'A problem in validator-logic bank configuration,' +
            'in compareWithFiled, the format should be something like [cmd]:[field].',
            data: {
              currentCompareWithFiled: elem,
            },
          });
        }

        paramName = allParamPath.filter((path) => {
          return path.name.toLowerCase() === paramName;
        });
        if (paramName.length !== 1) {
          throw new InternalError().setDetails({
            message: 'The Target param not find.',
            data: {
              targetFiledToMatch: elem,
            },
          });
        } else {
          paramName = paramName[0];
        }
        return {cmd: cmd, target: paramName};
      });
      p.push({me: v, targets: requireParamName});
      return p;
    }, [])
      .forEach((pair) => {
        res = res.map((elem) => {
          if (Object.keys(elem)[0] === pair.me.name) {
            elem[pair.me.name].status = elem[pair.me.name].status && validator.compareWithOtherParam(pair);
            return elem;
          } else {
            return elem;
          }
        });
      });

    return res;
  },
  getAllPath(target, basePath) {
    const out = {
      required: [],
      notRequired: [],
    };
    if (basePath === undefined) {
      basePath = '';
    }
    const parentsKey = Object.keys(target).filter((key) => {
      return target[key].type === undefined;
    });
    const valuesKeyReq = Object.keys(target).filter((key) => {
      return target[key].type !== undefined && (target[key].required === true || target[key].required === undefined);
    });
    const valuesKeyNotReq = Object.keys(target).filter((key) => {
      return target[key].type !== undefined && (target[key].required === false);
    });

    valuesKeyReq.forEach((valueKey) => {
      out.required.push((basePath !== '' ? basePath + '.' : '') + valueKey);
    });
    valuesKeyNotReq.forEach((valueKey) => {
      out.notRequired.push((basePath !== '' ? basePath + '.' : '') + valueKey);
    });

    parentsKey.forEach((parentKey) => {
      const tmp = privateZone.getAllPath(target[parentKey], (basePath === '' ? parentKey : basePath + '.' + parentKey));
      tmp.required.forEach((pair) => {
        if (pair[0] === '.') {
          pair = pair.substring(1, pair.length);
        }
        out.required.push(pair);
      });
      tmp.notRequired.forEach((pair) => {
        if (pair[0] === '.') {
          pair = pair.substring(1, pair.length);
        }
        out.notRequired.push(pair);
      });
    });

    return out;
  },
  getParamConfig(target, path) {
    const paths = path.split('.');
    let tmpTarget = _.cloneDeep(target);
    for (let i = 0; i < paths.length; i++) {
      tmpTarget = tmpTarget[paths[i]];
    }
    return _.cloneDeep(tmpTarget);
  },

  getParamVal(param, path) {
    return privateZone.getParamConfig(param, path);
  },

  paramConfigChecker(paramConfig, paramValue) {
    let res = {};

    if (paramConfig.type.toLowerCase() === 'array') {
      res.requiredDataType = paramConfig.type;
      if (paramConfig['null-allowed'] && paramValue === null) {
        res.dataFormatPass = true;
        res.dataTypePassed = true;
        res.status = true;
      } else {
        res.dataTypePassed = Array.isArray(paramValue);
        if (paramConfig.rows !== undefined && res.dataTypePassed) {
          const that = privateZone;
          res.rows = paramValue.map((row) => {
            return that.paramConfigChecker(paramConfig.rows, row);
          });
          res.status = res.rows.reduce((p, v) => {
            return p && v.status;
          }, true);
        } else if (res.dataTypePassed === false) {
          res.status = false;
        } else if (res.dataTypePassed && !paramConfig.rows) {
          // todo should implement for row by row checking
          throw new InternalError().setDetails({
            message: 'Param config is invalid,define rows configuration.',
            data: paramConfig,
          });
        }
      }
    } else if (paramConfig.type.toLowerCase() === 'object') {
      res.requiredDataType = paramConfig.type;
      if (paramConfig['null-allowed'] && paramValue === null && paramConfig.body) {
        res.dataFormatPass = true;
        res.dataTypePassed = true;
        res.status = true;
      } else if (!paramConfig.body) {
        throw new InternalError()
          .setDetails({
            message: 'Invalid ParamConfig for Object Data Type.',
            data: paramConfig,
          });
      } else {
        const objectDetails = paramConfig.body;
        const that = this;
        const matchRequireRes = that.matchRequirement(objectDetails, paramValue);
        if (matchRequireRes !== null) {
          res.missedItemUnderObject = JSON.stringify(matchRequireRes);
          res.status = false;
        } else {
          const matchFieldsRes = that.matchFieldsDataType(objectDetails, paramValue);
          res.status = true;
          res.childs = [];
          matchFieldsRes.filter((matchFieldRes) => {
            return !matchFieldRes[Object.keys(matchFieldRes)[0]].status;
          }).forEach((problem) => {
            res.status = false;
            res.childs.push(problem);
          });
        }
      }
    } else {
      const fn = DataTypeValidator[paramConfig.type.toLowerCase()];
      if (fn) {
        res = fn(paramConfig, paramValue);
      } else {
        throw new InternalError().setDetails({
          message: 'Data type  not implemented.',
          data: {
            requestedType: paramConfig.type,
          },
        });
      }
    }
    return res;
  },

};
