/**
 * Created by roten on 11/20/17.
 */

const should = require('should');

const Number = require('../../../../lib/Helper/DataTypeValidator/Number');
describe('#DataTypeValidator', () => {
    "use strict";
    describe('#email', () => {
        it('-should pass\t valid Number', () => {
            let res = Number({
                type: 'number',

            }, 1)
            res.should.have.properties({
                requiredDataType: 'number',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            });
        })
        it('-should pass\t null Number', () => {
            let res = Number({
                type: 'Number',
                'null-allowed': true

            }, null);
            res.should.have.properties({
                requiredDataType: 'Number',
                dataTypePassed: true,
                dataFormatPass: true,
                status: true
            })
        })
        it('-should pass min validation',()=>{
            let res = Number({
                type: 'number',
                min:0

            }, 1)
            res.should.have.properties({
                requiredDataType: 'number',
                dataFormatPass: true,
                dataTypePassed: true,
                status: true,
                minValueAllowed: 0,
                minValuePassed: true
            });
        })
        it('-should failed min validation',()=>{
            let res = Number({
                type: 'number',
                min:2

            }, 1)
            res.should.have.properties({
                requiredDataType: 'number',
                dataFormatPass: true,
                dataTypePassed: true,
                status: false,
                minValueAllowed: 2,
                minValuePassed: false
            });
        })
        it('-should pass max validation',()=>{
            let res = Number({
                type: 'number',
                max:2

            }, 1)
            res.should.have.properties({
                requiredDataType: 'number',
                dataFormatPass: true,
                dataTypePassed: true,
                status: true,
                maxValueAllowed: 2,
                maxValuePassed: true
            });
        })
        it('-should failed max validation',()=>{
            let res = Number({
                type: 'number',
                max:0

            }, 1)
            res.should.have.properties({
                requiredDataType: 'number',
                dataFormatPass: true,
                dataTypePassed: true,
                status: false,
                maxValueAllowed: 0,
                maxValuePassed: false
            });
        })
        it('-should failed an error due an invalid Number .', () => {
            let res = Number({type: 'Number'}, 't');
            should(res).have.properties({
                requiredDataType: 'Number',
                dataTypePassed: false,
                dataFormatPass: true,
                status: false
            });
        })
    })
})