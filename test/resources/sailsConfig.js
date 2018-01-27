/**
 * Created by roten on 11/19/17.
 */
'use strict';

const ParamValidator = require('../../index').Middelware.SailsJS;

module.exports = {
  log: {
    level: 'silent',
  },
  models: {
    connection: 'test',
    migrate: 'drop',
  },
  connection: {
    test: {
      adapter: 'sails-memory',
    },
  },
  hooks: {
    grunt: false,
  },
  routes: {
    '/:inPathVar': (req, res) => { // eslint-disable-lint valid-jsdoc
      res.send('ok');
    },
    'get /test': (req, res) => { // eslint-disable-lint valid-jsdoc
      res.send('ok');
    },

  },
  http: {

    middleware: {

      order: [
        'cookieParser',
        'session',
        'bodyParser',
        'compress',
        'poweredBy',
        '$custom',
        'paramValidator',
        'router',
        'www',
        'favicon',
        '404',
        '500',
      ],
      /** **************************************************************************
             *                                                                           *
             * Param Validator                                                           *
             *                                                                           *
             ****************************************************************************/
      /* eslint-disable valid-jsdoc */
      paramValidator: function(req, res, next) {
        /* eslint-disable valid-jsdoc */
        try {
          const paramValidator = new ParamValidator(sails, { // eslint-disable-line no-undef
            projectBaseDIR: __dirname,
            routeConfig: 'routeConfig/SailsJS',
            scriptValidatorPath: 'routeConfig/SailsJS/script',
            excludePrefix: '^\\/test\\/*',
          });
          paramValidator.validator(req, res, next);
        } catch (e) {
          // todo replace with ParamValidator Logger, console.log(e.message);
          next();
        }
      },
    },
  },
};

