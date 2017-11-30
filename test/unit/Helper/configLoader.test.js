/**
 * Created by roten on 11/17/17.
 */

const should = require('should');
const configLoader = require('../../../lib/Helper').ConfigLoader;
const path = require('path');
const fs = require('fs');
const PVError = require('../../../lib/Error');
const loadValidationRouteBank = (fileName) => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../resources/validationResource/', fileName)));
}
describe('#Config loader - Helper/ConfigLoader.js', () => {
    "use strict";
    describe('-test RouteBank loader', () => {
        it('-Should load correctly the route config\t load the simple route config ', () => {
            const routeConfig = 'routeConfig/simple';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.simple.json'));
        })
        it('-Should load correctly the route config\t load the script route config ', () => {
            const routeConfig = 'routeConfig/script';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.script.json'));
        })
        it('-Should load correctly the route config\t load the test route config ', () => {
            const routeConfig = 'routeConfig/test';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.test.json'));
        })
        it('-Should load correctly the route config\t load the test1 route config ', () => {
            const routeConfig = 'routeConfig/test1';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.test1.json'));
        })
        it('-Should load correctly the route config\t load the test2 route config ', () => {
            const routeConfig = 'routeConfig/test2';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.test2.json'));
        })
        it('-Should load correctly the route config\t load the API1 route config ', () => {
            const routeConfig = 'routeConfig/API1';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.API1.json'));
        })
        it('-Should load correctly the route config\t load the API2 route config ', () => {
            const routeConfig = 'routeConfig/API2';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            const paramValidatorConfig = configLoader(moduleConfig);
            paramValidatorConfig.should.have.property('routeConfig');
            paramValidatorConfig.routeConfig.should.have.properties(loadValidationRouteBank('RouteBank.API2.json'));
        })
        it('-should throw Internal Error \t invalid route config path', (done) => {
            try {
                configLoader({routeConfig: "invalid path"});
                done(new Error(' config loader cannot detect invalid path'))
            }
            catch (err) {
                if (err instanceof PVError) {
                    done()
                }
                else {
                    done('An unhandled error happened.');
                }
            }

        })
        it('-should throw Internal Error \t duplicate routes', (done) => {
            const routeConfig = 'routeConfig/DuplicateRoutes';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            try {
                configLoader(moduleConfig);
                done(new Error('Duplicate error not cached'));
            }
            catch (err) {
                if (err instanceof PVError) {
                    err.message.should.be.eql('Internal Error.');
                    err.getDetails().should.have.properties({
                        "message": "a duplicate route find in route config",
                        "data": {
                            "bank": {
                                "/test": {
                                    "get": {
                                        "URL": "/test",
                                        "METHOD": "get",
                                        "BODY": {}
                                    }
                                }
                            },
                            "duplicateURL": "/test",
                            "duplicateMethod": "get"
                        }
                    })
                    done();
                }
                else {
                    done(new Error('Invalid error happening'));
                }
            }
        })
        it('-should throw Internal Error \t invalid route config', (done) => {
            const routeConfig = 'routeConfig/InvalidConfig';
            const moduleConfig = require('../../resources/sampleConfig');
            moduleConfig.routeConfig = routeConfig;
            try {
                configLoader(moduleConfig);
                done(new Error('Invalid Route Config error not cached'));
            }
            catch (err) {
                if (err instanceof PVError) {
                    err.message.should.be.eql('Internal Error.');
                    err.getDetails().should.have.properties({
                        "message": "Param config is not valid ",
                        "data": {
                            "happenOn": "{\"url\":\"/testComplex\",\"method\":\"get\",\"body\":{}}"
                        }
                    })
                    done();
                }
                else {
                    done(new Error('Invalid error happening'));
                }
            }
        })

    })

})
