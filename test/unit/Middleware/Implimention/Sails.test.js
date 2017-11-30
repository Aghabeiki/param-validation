/**
 * Created by roten on 11/17/17.
 */

const should = require('should');
const SailsJS = require('../../../../lib/Middelware').SailsJS;

describe('#Middelware\t SailsJS', () => {
    "use strict";
    let sailsjs = null;
    let mockSailsApp = null;
    it('-Should create sails param validator-logic middleware correctly', () => {
        function Sails() {
            this.config = {
                routes: {
                    '/': {}
                }
            }
        };
        mockSailsApp = new Sails();
        const moduleConfig = require('../../../resources/sampleConfig')
        moduleConfig.routeConfig = 'routeConfig/API1';

        sailsjs = new SailsJS(mockSailsApp,moduleConfig);

    })
    it('-Should call loadAppRouteConfig correctly ', () => {
        sailsjs.loadAppRouteConfig(mockSailsApp).should.have.properties({
            get: ['/'],
            delete: ['/'],
            patch: ['/'],
            post: ['/'],
            put: ['/']
        })
    })

})