/**
 * Created by roten on 11/17/17.
 */

const should = require('should');
const PVError = require('../../../../lib/Error/index');
const BaseInterface = require('../../../../lib/Middelware/BaseMiddelware/BaseInterface');

describe('#Middleware\t BaseInterface', () => {
    "use strict";
    it('check basic interface exist  BaseInterface', () => {
        should(typeof BaseInterface.prototype.loadAppRouteConfig).be.eql('function');
        should(typeof BaseInterface.prototype.validator).be.eql('function');

        try {
            BaseInterface.prototype.loadAppRouteConfig({})
            throw new Error('Load App Config not fir Error');
        }
        catch (err) {
            if (!(err instanceof PVError)) {
                throw new Error(' Load App Config not work well');
            }
        }

        try {
            BaseInterface.prototype.validator();
            throw new Error('validator-logic not fir Error');
        }
        catch (err) {
            if (!(err instanceof PVError)) {
                throw new Error('validator-logic not work well');
            }
        }
        BaseInterface.prototype.context = 'test';
        BaseInterface.prototype.context.should.be.eql('test');
    })
})