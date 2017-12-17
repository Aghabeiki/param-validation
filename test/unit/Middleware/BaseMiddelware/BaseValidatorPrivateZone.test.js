/**
 * Created by roten on 11/21/17.
 */
'use strict';

const BaseValidatorPrivateZone = require('../../../../lib/Middelware/BaseMiddelware/BaseValidatorPrivateZone');
const PVError = require('../../../../lib/Error');
describe('#BaseValidatorPrivateZone', () => {
  describe('#isScriptBase ', () => {
    it('- Should pass', () => {
      should(BaseValidatorPrivateZone.isScriptBase({SCRIPT: 'script.js'})).be.ok();
    });
    it('- Should reject \t undefined script', () => {
      should(BaseValidatorPrivateZone.isScriptBase({})).not.be.ok();
    });
    it('- Should reject \t null script', () => {
      should(BaseValidatorPrivateZone.isScriptBase({SCRIPT: null})).not.be.ok();
    });
    it('- Should reject \t empty string script', () => {
      should(BaseValidatorPrivateZone.isScriptBase({SCRIPT: ''})).not.be.ok();
    });
  });

  describe('#matchRequirement', () => {
    it('-Should reject \t missed required params. ', () => {
      const res = BaseValidatorPrivateZone.matchRequirement({
        testParam: {
          type: 'string',
          length: 3,
        },
      }, {});
      res.should.be.an.Array().with.length(1);
      res[0].should.have.properties({path: 'testParam', missed: true});
    });
  });

  describe('#matchFieldsDataType', () => {
    it('-should pass in required path.\t multi type param.', () => {
      const res = BaseValidatorPrivateZone.matchFieldsDataType({
        testParam: {
          type: 'string|number',
          length: 4,
        },
      }, {
        testParam: 'test',
      });
      res.should.be.an.Array().with.length(1);
      res[0].should.have.properties({
        testParam: {
          requiredDataType: 'string',
          dataTypePassed: true,
          dataFormatPass: true,
          status: true,
          lengthAllowed: 4,
          lengthPassed: true,
        },
      });
    });
    it('-should reject in required path.\t multi type param.', () => {
      const res = BaseValidatorPrivateZone.matchFieldsDataType({
        testParam: {
          type: 'string|number',
          length: 4,
        },
      }, {
        testParam: new Date(),
      });
      should(res).be.an.Array().with.length(1);
      res[0].should.have.properties({
        testParam: {
          string: {
            requiredDataType: 'string',
            dataTypePassed: false,
            dataFormatPass: true,
            status: false,
            lengthAllowed: 4,
            lengthPassed: false,
          },
          number: {
            requiredDataType: 'number',
            dataFormatPass: true,
            dataTypePassed: false,
            status: false,
          },
        },
      });
    });
    it('-should throw an error in required path.\t' +
      ' multi type param, String and Date should not match together.', (done) => {
      let error = null;
      try {
        BaseValidatorPrivateZone.matchFieldsDataType({
          testParam: {
            type: 'string|date',
          },
        }, {
          testParam: new Date().toISOString(),
        });
        done(new Error('This unit test should throw an error.'));
      } catch (err) {
        error = err;
      } finally {
        if (error instanceof PVError) {
          done();
        } else {
          done(new Error('An invalid Error Happen.'));
        }
      }
    });

    it('-should pass in non-required path.\t multi type param.', () => {
      const res = BaseValidatorPrivateZone.matchFieldsDataType({
        testParam: {
          type: 'string|number',
          length: 4,
          required: false,
        },
      }, {
        testParam: 'test',
      });
      res.should.be.an.Array().with.length(1);
      res[0].should.have.properties({
        testParam: {
          requiredDataType: 'string',
          dataTypePassed: true,
          dataFormatPass: true,
          status: true,
          lengthAllowed: 4,
          lengthPassed: true,
        },
      });
    });
    it('-should reject in non-required path.\t multi type param.', () => {
      const res = BaseValidatorPrivateZone.matchFieldsDataType({
        testParam: {
          type: 'string|number',
          length: 4,
          required: false,
        },
      }, {
        testParam: new Date(),
      });
      should(res).be.an.Array().with.length(1);
      res[0].should.have.properties({
        testParam: {
          string: {
            requiredDataType: 'string',
            dataTypePassed: false,
            dataFormatPass: true,
            status: false,
            lengthAllowed: 4,
            lengthPassed: false,
          },
          number: {
            requiredDataType: 'number',
            dataFormatPass: true,
            dataTypePassed: false,
            status: false,
          },
        },
      });
    });
    it('-should throw an error in non-required path.\t ' +
      'multi type param, String and Date should not match together.', (done) => {
      let error = null;
      try {
        BaseValidatorPrivateZone.matchFieldsDataType({
          testParam: {
            type: 'string|date',
            required: false,
          },
        }, {
          testParam: new Date().toISOString(),
        });
        done(new Error('This unit test should throw an error.'));
      } catch (err) {
        error = err;
      } finally {
        if (error instanceof PVError) {
          done();
        } else {
          done(new Error('An invalid Error Happen.'));
        }
      }
    });

    it('-should check and pass compareWithOtherParam parts', () => {
      const res = BaseValidatorPrivateZone.matchFieldsDataType({
        param1: {
          type: 'number',
          compareWithFiled: ['<:param2'],
        },
        param2: {
          type: 'number',
        },
      }, {

        param1: 1,
        param2: 2,
      });
      res.should.be.an.Array().with.length(2);
      res[0].should.have.properties({
        param1: {
          requiredDataType: 'number',
          dataFormatPass: true,
          dataTypePassed: true,
          status: true,
        },
      });
      res[1].should.have.properties({
        param2: {
          requiredDataType: 'number',
          dataFormatPass: true,
          dataTypePassed: true,
          status: true,
        },
      });
    });
    it('-should throw an Internal Error\t pass invalid cmd and target params', (done) => {
      validateError(() => {
        BaseValidatorPrivateZone.matchFieldsDataType({
          param1: {
            type: 'number',
            compareWithFiled: ['invalidString'],
          },
          param2: {
            type: 'number',
          },
        }, {

          param1: 1,
          param2: 2,
        });
      }, PVError, (error) => {
        if (error instanceof PVError) {
          error.message.should.be.eql('Internal Error.');
          error.getDetails().should.have.properties({
            message: 'A problem in validator-logic bank configuration' +
            ',in compareWithFiled, the format should be something like [cmd]:[field].',
            data: {
              currentCompareWithFiled: 'invalidString',
            },
          });
          done();
        } else {
          done(new Error('The test throw an invalid Error.'));
        }
      });
    });
    it('-should throw an internal Error\t the compare target fields not found in the request.', (done) => {
      validateError(() => {
        BaseValidatorPrivateZone.matchFieldsDataType({
          param1: {
            type: 'number',
            compareWithFiled: ['>:param2'],
          },
          param2: {
            type: 'number',
            required: false,
          },
        }, {

          param1: 1,
        });
      }, PVError, (error) => {
        if (error instanceof PVError) {
          error.message.should.be.eql('Internal Error.');
          error.getDetails().should.have.properties({
            message: 'The Target param not find.',
            data: {targetFiledToMatch: '>:param2'},
          });
          done();
        } else {
          done(new Error('The test throw an invalid Error.'));
        }
      });
    });
  });

  describe('#getAllPath', () => {
    it('-Should find in deep param definition in config file.', () => {
      BaseValidatorPrivateZone.getAllPath({
        'normalParam': {
          type: 'string',
        },
        '.firstLevelParam': {
          multiLevel: {
            secondLevelParam: {
              type: 'string',
            },
          },
          secondLevelParamNotRequired: {
            type: 'string',
            required: false,
          },
        },
      }).should.have.properties({
        required: ['normalParam', 'firstLevelParam.multiLevel.secondLevelParam'],
        notRequired: ['firstLevelParam.secondLevelParamNotRequired'],
      });
    });
  });

  describe('#paramConfigChecker', () => {
    // Array
    it('-Should throw Internal Error\t invalid Array configuration.', (done) => {
      validateError(() => {
        BaseValidatorPrivateZone.paramConfigChecker({
          type: 'array',
        }, ['test']);
      }, PVError, (error) => {
        if (error instanceof PVError) {
          error.message.should.be.eql('Internal Error.');
          error.getDetails().should.have.properties({
            message: 'Param config is invalid,define rows configuration.',
            data: {type: 'array'},
          });
          done();
        } else {
          done(new Error('Test throw invalid error.'));
        }
      });
    });
    it('-Should pass\t with correct array config.', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        type: 'array',
        rows: {
          type: 'string',
        },
      }, ['test']);
      res.should.have.properties({
        requiredDataType: 'array',
        dataTypePassed: true,
        rows: [
          {
            requiredDataType: 'string',
            dataTypePassed: true,
            dataFormatPass: true,
            status: true,
          },
        ],
        status: true,
      });
    });
    it('-Should pass\t with acceptable null array config.', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        'type': 'array',
        'null-allowed': true,
        'rows': {
          type: 'string',
        },
      }, null);
      res.should.have.properties({
        requiredDataType: 'array',
        dataFormatPass: true,
        dataTypePassed: true,
        status: true,
      });
    });
    it('-Should fail \t invalid param.', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        type: 'array',
        rows: {
          type: 'string',
        },
      }, 'invalidArray');
      res.should.have.properties({requiredDataType: 'array', dataTypePassed: false, status: false});
    });

    // Object
    it('-should pass \t simple object param', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        type: 'object',
        body: {
          param1: {
            type: 'string',
          },
        },
      }, {
        param1: 'test',
      });
      res.should.have.properties({requiredDataType: 'object', status: true, childs: []});
    });
    it('-should throw Internal Error \t invalid configuration for Object data type.', (done) => {
      validateError(() => {
        BaseValidatorPrivateZone.paramConfigChecker({
          type: 'object',
        }, null);
      }, PVError, (error) => {
        if (error instanceof PVError) {
          error.message.should.be.eql('Internal Error.');
          error.getDetails().should.have.properties({
            message: 'Invalid ParamConfig for Object Data Type.',
            data: {type: 'object'},
          });
          done();
        } else {
          done(new Error('The test throw invalid Error.'));
        }
      });
    });
    it('-should pass \t object data type null able.', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        'type': 'object',
        'null-allowed': true,
        'body': {
          param1: {
            type: 'string',
          },
        },
      }, null);
      res.should.have.properties({
        requiredDataType: 'object',
        dataFormatPass: true,
        dataTypePassed: true,
        status: true,
      });
    });
    it('-should failed \t invalid param send to checker.', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        type: 'object',
        body: {
          p1: {
            type: 'string',
          },
        },
      }, {});
      res.should.have.properties({
        requiredDataType: 'object',
        missedItemUnderObject: '[{"path":"p1","missed":true}]',
        status: false,
      });
    });
    it('-should failed \t invalid param send to checker.', () => {
      const res = BaseValidatorPrivateZone.paramConfigChecker({
        type: 'object',
        body: {
          p1: {
            type: 'string',
            length: 2,
          },
        },
      }, {p1: 'test'});
      res.should.have.properties({
        requiredDataType: 'object',
        status: false,
        childs: [
          {
            p1: {
              requiredDataType: 'string',
              dataTypePassed: true,
              dataFormatPass: true,
              status: false,
              lengthAllowed: 2,
              lengthPassed: false,
            },
          },
        ],
      });
    });

    // Invalid data type.
    it('-should throw an error\t because of invalid Data Type', (done) => {
      validateError(() => {
        BaseValidatorPrivateZone.paramConfigChecker({
          type: 'invalidType',
        }, 'something');
      }, PVError, (error) => {
        if (error instanceof PVError) {
          error.message.should.be.eql('Internal Error.');
          error.getDetails().should.have.properties({
            message: 'Data type  not implemented.',
            data: {requestedType: 'invalidType'},
          });
          done();
        }
      });
    });
  });
});
