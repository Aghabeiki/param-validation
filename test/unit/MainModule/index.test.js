/**
 * Created by roten on 11/17/17.
 */
const should = require('should');
const BaseInterface = require('../../../lib/Middelware/BaseMiddelware/BaseInterface').constructor;
const PVError = require('../../../lib/Error');

describe('#MainModule', () => {
    "use strict";
    it('-should export  middleware interface', () => {
        should(require('../../../index').Middelware.SailsJS.constructor ===BaseInterface.constructor).be.ok();
        should(require('../../../index').Middelware.ExpressJS.constructor  ===BaseInterface.constructor).be.ok();
    })
    it('-should export PVError middleware interface', () => {
        should(require('../../../index').PVError.constructor instanceof PVError.constructor).be.ok();

    })
})