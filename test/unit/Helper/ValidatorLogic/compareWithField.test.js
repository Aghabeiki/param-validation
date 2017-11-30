/**
 * Created by roten on 11/20/17.
 */

const should = require('should');
const compareWithField = require('../../../../lib/Helper/validator-logic/index').compareWithOtherParam;
const PVError = require('../../../../lib/Error/index');

describe('#compareWithOtherParam', () => {
    "use strict";
    it('-Should pass\t testing on string and ==', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'string'
                },
                value: "123"
            },
            targets: [{
                target: {
                    config: {
                        type: "string"
                    },
                    "value": "123"
                },
                cmd: '=='
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and ===', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'number'
                },
                value: 1
            },
            targets: [{
                target: {
                    config: {
                        type: "number"
                    },
                    value: 1
                },
                cmd: '==='
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and >', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'string'
                },
                value: "its a large string"
            },
            targets: [{
                target: {
                    config: {
                        type: "string"
                    },
                    value: "a short string."
                },
                cmd: '>'
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and >=', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'string'
                },
                value: "123"
            },
            targets: [{
                target: {
                    config: {
                        type: "string"
                    },
                    "value": "123"
                },
                cmd: '>='
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and <', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'number'
                },
                value: 1
            },
            targets: [{
                target: {
                    config: {
                        type: "number"
                    },
                    value: 2
                },
                cmd: '<'
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and <=', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'number'
                },
                value: 2
            },
            targets: [{
                target: {
                    config: {
                        type: "number"
                    },
                    value: 3
                },
                cmd: '<='
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and !==', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'boolean'
                },
                value: true
            },
            targets: [{
                target: {
                    config: {
                        type: "boolean"
                    },
                    value: false
                },
                cmd: '!=='
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })
    it('-Should pass\t testing on string and !=', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'string'
                },
                value: "test"
            },
            targets: [{
                target: {
                    config: {
                        type: "string"
                    },
                    "value": "notEql"
                },
                cmd: '!='
            }]
        }
        should(compareWithField(samplePairs)).be.ok();

    })

    it('-should throw an error\t pass invalid compare in config file', (done) => {
        let error = null;
        const samplePairs = {
            me: {
                config: {
                    type: 'string'
                },
                value: "123"
            },
            targets: [{
                target: {
                    config: {
                        type: "string"
                    },
                    "value": "123"
                },
                cmd: '+='
            }]
        }
        try {
            compareWithField(samplePairs);
        }
        catch (err) {
            error = err;
        }
        if (!error) {
            done(new Error("This test required to throw an error."));
        }
        else if (error instanceof PVError) {
            error.message.should.be.eql('Internal Error.')
            error.getDetails().message.should.be.eql("Validator bank configuration is invalid for compareWithOtherParam.")
            error.getDetails().data.should.have.properties({pairs: samplePairs});
            done();

        }
        else {
            done(new Error("Unit test throw an Invalid Error."));
        }

    })

    it('-should return false\t not match data type.', () => {
        const samplePairs = {
            me: {
                config: {
                    type: 'number'
                },
                value: 1
            },
            targets: [{
                target: {
                    config: {
                        type: "string"
                    },
                    value: "1"
                },
                cmd: '==='
            }]
        }
        should(compareWithField(samplePairs)).not.be.ok();
    })
})
