/**
 * Created by roten on 11/20/17.
 */

const should = require('should');

const date = require('../../../../lib/Helper/DataTypeValidator/Date');
describe('#DataTypeValidator', () => {
    "use strict";
    describe('#date', () => {
        it('-should pass\t valid date', () => {
            let res = date({
                type: 'date',

            }, new Date().toISOString())
            res.should.have.properties({
                requiredDataType: 'date',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            });
        })
        it('-should pass\t null date', () => {
            let res = date({
                type: 'date',
                'null-allowed': true

            }, null);
            res.should.have.properties({
                requiredDataType: 'date',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            })
        })
        it('-should failed an error due invalid date value.', () => {
            let res = date({type: 'date'}, NaN);
            should(res).have.properties({
                requiredDataType: 'date',
                dataTypePassed: false,
                dataFormatPass: true,
                status: false
            });
        })
    })
})