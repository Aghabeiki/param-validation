/**
 * Created by roten on 11/20/17.
 */
'use strict';

const DateDataTypeValidator = require('../../../../lib/Helper/DataTypeValidator/Date');
describe('#DataTypeValidator', () => {
  describe('#date', () => {
    it('-should pass\t valid date', () => {
      const res = new DateDataTypeValidator({
        type: 'date',

      }, new Date().toISOString());
      res.should.have.properties({
        requiredDataType: 'date',
        dataTypePassed: true,
        dataFormatPass: true,
        status: true,
      });
    });
    it('-should pass\t null date', () => {
      const res = new DateDataTypeValidator({
        'type': 'date',
        'null-allowed': true,

      }, null);
      res.should.have.properties({
        requiredDataType: 'date',
        dataTypePassed: true,
        dataFormatPass: true,
        status: true,
      });
    });
    it('-should failed an error due invalid date value.', () => {
      const res = new DateDataTypeValidator({type: 'date'}, NaN);
      should(res).have.properties({
        requiredDataType: 'date',
        dataTypePassed: false,
        dataFormatPass: true,
        status: false,
      });
    });
  });
});
