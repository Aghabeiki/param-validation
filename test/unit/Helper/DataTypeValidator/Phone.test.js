/**
 * Created by roten on 11/20/17.
 */

'use strict';

const PhoneDataTypeValidator = require('../../../../lib/Helper/DataTypeValidator/Phone');
describe('#DataTypeValidator', () => {
  describe('#Phone', () => {
    it('-should pass\t valid Phone', () => {
      const res =new PhoneDataTypeValidator({
        type: 'Phone',

      }, '+60127623452');
      res.should.have.properties({
        requiredDataType: 'Phone',
        dataTypePassed: true,
        dataFormatPass: true,
        status: true,
      });
    });
    it('-should pass\t null Phone', () => {
      const res =new PhoneDataTypeValidator({
        'type': 'Phone',
        'null-allowed': true,

      }, null);
      res.should.have.properties({
        requiredDataType: 'Phone',
        dataTypePassed: true,
        dataFormatPass: true,
        status: true,
      });
    });
    it('-should failed an error due an invalid Phone .', () => {
      const res = new PhoneDataTypeValidator({type: 'Phone'}, '1234');
      should(res).have.properties({
        requiredDataType: 'Phone',
        dataTypePassed: false,
        dataFormatPass: true,
        status: false,
      });
    });
  });
});
