'use strict';

const PVError = require('../../../../lib/Error/index');
const BaseInterface = require('../../../../lib/Middelware/BaseMiddelware/BaseInterface');
const path = require('path');
describe('#Middleware\t BaseValidator', () => {
  let baseValidator = null;

  before((done) => {
    /**
     * @description a mocked validatior
     */
    class MockValidator extends BaseInterface {
      /**
       *  @description mocked load App Route Config.
       * @return {{}}
       */
      loadAppRouteConfig() {
        return {};
      }
    }

    const TestValidator = MockValidator;
    baseValidator = new TestValidator({}, {
      projectBaseDIR: path.resolve(__dirname, '../../../resources'),
      routeConfig: 'routeConfig/API1',
      scriptValidatorPath: 'routeConfig/scriptValidation',
      excludePrefix: null,
    });
    done();
  });
  it('-should pass when call private getter.', () => {
    baseValidator.private.should.be.ok();
  });

  it('-should run findRule method\t should pass', () => {
    should(baseValidator.findRule('/airports(/:country_code)', 'get'))
      .have.properties({
        URL: '/airports(/:country_code)',
        METHOD: 'GET',
        InPath: {
          country_code: {type: 'string', length: 2, required: false},
        },
      });
  });
  it('-should throw an error\t in findRule function when key and/or method dose not pass. ', () => {
    validateError(()=>{
      baseValidator.findRule();
    }, PVError, (error)=>{
      if (error instanceof PVError) {
        error.message.should.be.eql('Internal Error.');
        error.getDetails().should.have.properties({
          message: 'In findRule function, key or method is/are not passed correctly.',
          data: {key: undefined, method: undefined},
        });
      } else if (!error) {
        throw new Error('This scenario should thrown an error.');
      } else {
        throw new Error('Invalid Error thrown.');
      }
    });
  });
  it('-should throw an error\t in findRule function,when the rule not find. ', () => {
    validateError(() => {
      baseValidator.findRule('/airports(/:country_code)', 'post');
    }, PVError, (error) => {
      if (error instanceof PVError) {
        error.message.should.be.eql('Internal Error.');
        should(error.getDetails()).have.properties({
          message: 'In findRule function,the passed key and method are not valid.',
          data: {key: '/airports(/:country_code)', method: 'post'},
        });
      } else if (!error) {
        throw new Error('This scenario should thrown an error.');
      } else {
        throw new Error('Invalid Error thrown.');
      }
    });
  });

  // todo fix this test.
  /* it('-should pass\t execute ruleExecutor.', () => {
    const rule = baseValidator.findRule('/airports(/:country_code)', 'get');
    baseValidator.ruleExecutor(rule, {country_code: 'IR'});
  });*/
});
