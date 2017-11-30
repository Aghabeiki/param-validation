/**
 * Created by roten on 11/20/17.
 */

const should = require('should');

const Boolean = require('../../../../lib/Helper/DataTypeValidator/Boolean');
describe('#DataTypeValidator', () => {
    "use strict";
    describe('#boolean', () => {
        it('-should pass\t valid value', () => {
            let res = Boolean({
                type: 'boolean',

            }, true)
            res.should.have.properties({requiredDataType: 'boolean', dataTypePassed: true, status: true});
        })
        it('-should pass\t null value', () => {
            let res = Boolean({
                type: 'boolean',
                'null-allowed': true

            }, null);
            res.should.have.properties({
                requiredDataType: 'boolean',
                dataTypePassed: true,
                status: true
            })
        })
        it('-should failed an error due invalid date', () => {
            let res = Boolean(null, true);
            should(res).have.properties({
                message: 'Cannot read property \'type\' of null',
                dataTypePassed: false,
                status: false
            });
        })
    })
})