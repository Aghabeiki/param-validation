/**
 * Created by roten on 11/17/17.
 */
'use strict';

const index = require('../../../lib/Middelware');

describe('#Middelware\t index', () => {
  it('-Should find sails.js exports', () => {
    index.SailsJS.should.be.eql(require('../../../lib/Middelware/implimention/Sails'));
  });
  it('-Should find express.js exports', () => {
    index.ExpressJS.should.be.eql(require('../../../lib/Middelware/implimention/Express'));
  });
});
