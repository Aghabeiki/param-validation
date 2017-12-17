/**
 * Created by roten on 11/20/17.
 */
'use strict';

module.exports = {
  compareWithOtherParam: require('./compareWithField'),
  regexParamValidator: require('./regexParamValidator'),
  validateEmail: require('./validateEmail'),
  phoneUtil: require('google-libphonenumber').PhoneNumberUtil.getInstance(),

};
