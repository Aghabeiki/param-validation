/**
 * Created by roten on 11/20/17.
 */

module.exports = {
    compareWithOtherParam: require('./compareWithField'),
    regexParamValidator: require('./regexParamValidator'),
    validateEmail: require('./validateEmail'),
    phoneUtil: require('google-libphonenumber').PhoneNumberUtil.getInstance()

}
