/**
 * Created by roten on 11/19/17.
 */

let ParamValidator = require('../../index').Middelware.SailsJS;

module.exports = {
    log: {
        level: 'silent'
    },
    models: {
        connection: 'test',
        migrate: 'drop'
    },
    connection: {
        test: {
            adapter: 'sails-memory'
        },
    },
    routes: {
        '/': (req, res) => {
            res.send('ok');
        }

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
                '500'
            ],
            /****************************************************************************
             *                                                                           *
             * Param Validator                                                           *
             *                                                                           *
             ****************************************************************************/
            paramValidator: function (req, res, next) {

                try {
                    let paramValidator = new ParamValidator(sails, {
                        projectBaseDIR: __dirname,
                        routeConfig: 'routeConfig/SailsJS',
                        scriptValidatorPath: 'routeConfig/SailsJS/script',
                        excludePrefix: null
                    });
                    paramValidator.validator(req, res, next);
                }
                catch (e) {
                    console.log(e.message);
                    next();
                }

            },
        }
    }
}

