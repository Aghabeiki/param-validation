/**
 * Created by roten on 11/20/17.
 */

'use strict';

const BooleanDataTypeValidator = require('../../../../lib/Helper/DataTypeValidator/Boolean');
describe('#DataTypeValidator', () => {
  describe('#boolean', () => {
    it('-should pass\t valid value', () => {
      const res = new BooleanDataTypeValidator({
        type: 'boolean',

      }, true);
      res.should.have.properties({requiredDataType: 'boolean', dataTypePassed: true, status: true});
    });
    it('-should pass\t null value', () => {
      const res = new BooleanDataTypeValidator({
        'type': 'boolean',
        'null-allowed': true,

      }, null);
      res.should.have.properties({
        requiredDataType: 'boolean',
        dataTypePassed: true,
        status: true,
      });
    });
    it('-should failed an error due invalid date', () => {
      const res = new BooleanDataTypeValidator(null, true);
      should(res).have.properties({
        message: 'Cannot read property \'type\' of null',
        dataTypePassed: false,
        status: false,
      });
    });
  });
});
