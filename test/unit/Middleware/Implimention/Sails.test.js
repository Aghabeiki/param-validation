/**
 * Created by roten on 11/17/17.
 */
'use strict';

const SailsJS = require('../../../../lib/Middelware').SailsJS;

describe('#Middelware\t SailsJS', () => {
  let sailsjs = null;
  let mockSailsApp = null;
  it('-Should create sails param validator-logic middleware correctly', () => {
    /**
       * @description a mocked Sails app.
       * @constructor
       */
    function Sails() {
      this.config = {
        routes: {
          '/': {},
        },
      };
    }
    mockSailsApp = new Sails();
    const moduleConfig = require('../../../resources/sampleConfig');
    moduleConfig.routeConfig = 'routeConfig/API1';

    sailsjs = new SailsJS(mockSailsApp, moduleConfig);
  });
  it('-Should call loadAppRouteConfig correctly ', () => {
    sailsjs.loadAppRouteConfig(mockSailsApp).should.have.properties({
      get: ['/'],
      delete: ['/'],
      patch: ['/'],
      post: ['/'],
      put: ['/'],
    });
  });
});
