/**
 * Created by roten on 11/20/17.
 */

'use strict';

const EmailDataTypeValidator = require('../../../../lib/Helper/DataTypeValidator/Email');
describe('#DataTypeValidator', () => {
  describe('#email', () => {
    it('-should pass\t valid email', () => {
      const res = new EmailDataTypeValidator({
        type: 'Email',

      }, 'amin.aghabeiki@gmail.com');
      res.should.have.properties({
        requiredDataType: 'Email',
        dataTypePassed: true,
        dataFormatPass: true,
        status: true,
      });
    });
    it('-should pass\t null email', () => {
      const res = new EmailDataTypeValidator({
        'type': 'Email',
        'null-allowed': true,

      }, null);
      res.should.have.properties({
        requiredDataType: 'Email',
        dataTypePassed: true,
        dataFormatPass: true,
        status: true,
      });
    });
    it('-should failed an error due an invalid Email .', () => {
      const res = new EmailDataTypeValidator({type: 'Email'}, 'amin@test');
      should(res).have.properties({
        requiredDataType: 'Email',
        dataTypePassed: false,
        dataFormatPass: true,
        status: false,
      });
    });
  });
});
