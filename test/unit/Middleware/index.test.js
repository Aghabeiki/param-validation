/**
 * Created by roten on 11/17/17.
 */

const should = require('should');
const index = require('../../../lib/Middelware');

describe('#Middelware\t index', () => {
    "use strict";
    it('-Should find sails.js exports', () => {
        index.SailsJS.should.be.eql(require('../../../lib/Middelware/implimention/Sails'));
    })
    it('-Should find express.js exports', () => {
        index.ExpressJS.should.be.eql(require('../../../lib/Middelware/implimention/Express'));
    })
})