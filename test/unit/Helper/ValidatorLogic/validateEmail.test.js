/**
 * Created by roten on 11/20/17.
 */

const should = require('should');
const validateEmail = require('../../../../lib/Helper/validator-logic/index').validateEmail;

describe('#validateEmail', () => {
    "use strict";
    it('-should pass for a valid email.', () => {
        should(validateEmail("amin.aghabeiki@gmail.com")).be.ok();
    })
    it('-should failed for an invalid valid email.', () => {
        should(validateEmail("amin.aghabeiki{at}gmail.com")).not.be.ok();
    })
})