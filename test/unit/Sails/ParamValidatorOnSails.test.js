/**
 * Created by roten on 11/19/17.
 */
'use strict';

const sails = require('sails');
const should = require('should');
const request = require('supertest');
const SailsInterface = require('../../../index').Middelware.SailsJS;
const PVError = require('../../../index').PVError;
const config = require('../../resources/sailsConfig');
const path = require('path');

describe('#Param Validator on Sails.', () => {
  before(function(done) {
    this.timeout(7000); // eslint-disable-line  no-invalid-this
    sails.lift(config, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  it('-Param Checking \t thought param validator. ', (done) => {
    request(sails.hooks.http.app)
      .post('/inPathParam/?queryParam=12')
      .set({test: 'test'})
      .send({
        bodyParam: 'IR',
      })
      .expect(200)
      .then((response) => {
        response.res.text.should.be.eql('ok');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('-Param Checking \t thought exclude path. ', (done) => {
    request(sails.hooks.http.app)
      .get('/test?testInQuery=12')
      .send({
        bodyParam: 'test',
      })
      .expect(200)
      .then((response) => {
        response.res.text.should.be.eql('ok');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('-Should throw an error\t pass a none Sails app to Sails implementation.', () => {
    validateError(() => {
      new SailsInterface({}, config);
    }, PVError, (error) => {
      should(error.message).be.eql('Internal Error.');
      should(error.getDetails()).have.properties({message: 'The passed app is not sails.', data: {}});
    });
  });
  it('-Should throw an error\t path not exist in route config. ', () => {
    const config = {
      projectBaseDIR: path.resolve(__dirname, '../../resources/'),
      routeConfig: 'routeConfig/SailsJS',
      scriptValidatorPath: 'routeConfig/scriptValidation',
      excludePrefix: null,
    };
    const testRequestParser = new SailsInterface(sails, config);
    validateError(() => {
      testRequestParser.requestParser({
        method: 'get',
        url: '/invalid/URL?test=test',
      });
    }, PVError, (error) => {
      should(error.message).be.eql('Internal Error.');
      should(error.getDetails()).have.properties({
        message: 'The URL in request not match with any of our routeConfig.',
        data: {
          routeConfig: {
            '/(:inpathvar)': {
              post: {
                URL: '/(:inPathVar)',
                METHOD: 'post',
                QueryParam: {testInQuery: {type: 'string', length: 2}},
                InPath: {inPathVar: {type: 'string'}},
                HEADER: {test: {type: 'string', length: 4}},
                BODY: {
                  bodyParam: {type: 'string', length: 4, required: false},
                },
              },
            },
            '(/:testinpath/)': {
              post: {
                URL: '(/:testInPath/)',
                METHOD: 'post',
                QueryParam: {queryParam: {type: 'string'}},
                inPath: {},
                header: {},
                BODY: {
                  bodyParam: {type: 'string', length: 2, required: false},
                },
              },
            },
            '/': {
              get: {
                URL: '/',
                METHOD: 'get',
                QueryParam: {queryParam: {type: 'string'}},
                inPath: {},
                header: {},
                BODY: {
                  bodyParam: {type: 'string', length: 2, required: false},
                },
              },
            },
          },
          requestedURL: '/invalid/URL?test=test',
          requestedMethod: 'get',
        },
      });
    });
  });
  it('-Should return request info\t test for requestParser in sails implementation. ', () => {
    const config = {
      projectBaseDIR: path.resolve(__dirname, '../../resources/'),
      routeConfig: 'routeConfig/SailsJS',
      scriptValidatorPath: 'routeConfig/scriptValidation',
      excludePrefix: null,
    };
    const testRequestParser = new SailsInterface(sails, config);
    const requestInfo = testRequestParser.requestParser({
      method: 'post',
      url: '/test?test=test',
    });
    requestInfo.url.should.be.eql('/test');
    requestInfo.method.should.be.eql('post');
    requestInfo.ruleKey.should.be.eql('/(:inpathvar)');
    should(requestInfo.params.headers).be.null();
    should(requestInfo.params.body).be.null();
    should(requestInfo.params.queryString).have.properties({test: 'test'});
    should(requestInfo.params.path).have.properties({inpathvar: 'test'});
  });

  after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
  });
});
