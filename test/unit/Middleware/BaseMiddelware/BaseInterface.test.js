/**
 * Created by roten on 11/17/17.
 */
'use strict';

const PVError = require('../../../../lib/Error/index');
const BaseInterface = require('../../../../lib/Middelware/BaseMiddelware/BaseInterface');

describe('#Middleware\t BaseInterface', () => {
  it('check basic interface exist  BaseInterface', () => {
    should(typeof BaseInterface.prototype.loadAppRouteConfig).be.eql('function');
    should(typeof BaseInterface.prototype.validator).be.eql('function');

    validateError(() => {
      BaseInterface.prototype.loadAppRouteConfig({});
    }, PVError, (err) => {
      if (!(err instanceof PVError)) {
        throw new Error(' Load App Config not work well');
      }
    });
    validateError(() => {
      BaseInterface.prototype.validator();
    }, PVError, (err) => {
      if (!(err instanceof PVError)) {
        throw new Error('validator-logic not work well');
      }
    });
    BaseInterface.prototype.context = 'test';
    BaseInterface.prototype.context.should.be.eql('test');
  });
});
