/**
 * Created by roten on 11/17/17.
 */

const {InternalError} = require('../../Error/index');
const BaseValidator = require('./BaseValidator');
class BaseInterface extends BaseValidator{


    loadAppRouteConfig(app) {
        throw new InternalError().setDetails({
            message: "`loadAppConfig` not implemented.",
            data: {}
        })
    }

    validator(...args) {
        throw new InternalError().setDetails({
            message: "`validator-logic` not implemented.",
            data: {}
        })
    }


    requestParser(req) {
        throw new InternalError().setDetails({
            message: "`requestParser` not implemented.",
            data: {}
        })
    }


}


module.exports = BaseInterface;