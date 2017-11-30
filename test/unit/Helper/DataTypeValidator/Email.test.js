/**
 * Created by roten on 11/20/17.
 */

const should = require('should');

const Email = require('../../../../lib/Helper/DataTypeValidator/Email');
describe('#DataTypeValidator', () => {
    "use strict";
    describe('#email', () => {
        it('-should pass\t valid email', () => {
            let res = Email({
                type: 'Email',

            }, 'amin.aghabeiki@gmail.com')
            res.should.have.properties({
                requiredDataType: 'Email',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            });
        })
        it('-should pass\t null email', () => {
            let res = Email({
                type: 'Email',
                'null-allowed': true

            }, null);
            res.should.have.properties({
                requiredDataType: 'Email',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            })
        })
        it('-should failed an error due an invalid Email .', () => {
            let res = Email({type: 'Email'}, 'amin@test');
            should(res).have.properties({
                requiredDataType: 'Email',
                dataTypePassed: false,
                dataFormatPass: true,
                status: false
            });
        })
    })
})