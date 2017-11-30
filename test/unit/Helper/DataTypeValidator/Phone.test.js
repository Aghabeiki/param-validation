/**
 * Created by roten on 11/20/17.
 */

const should = require('should');

const Phone = require('../../../../lib/Helper/DataTypeValidator/Phone');
describe('#DataTypeValidator', () => {
    "use strict";
    describe('#Phone', () => {
        it('-should pass\t valid Phone', () => {
            let res = Phone({
                type: 'Phone',

            }, '+60127623452')
            res.should.have.properties({
                requiredDataType: 'Phone',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            });
        })
        it('-should pass\t null Phone', () => {
            let res = Phone({
                type: 'Phone',
                'null-allowed': true

            }, null);
            res.should.have.properties({
                requiredDataType: 'Phone',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            })
        })
        it('-should failed an error due an invalid Phone .', () => {
            let res = Phone({type: 'Phone'}, '1234');
            should(res).have.properties({
                requiredDataType: 'Phone',
                dataTypePassed: false,
                dataFormatPass: true,
                status: false
            });
        })
    })
})