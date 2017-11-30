/**
 * Created by roten on 11/17/17.
 */

const BaseMiddleware = require('../BaseMiddelware');

class Express extends BaseMiddleware {

    validator(req, res, next) {
        next();
    }
}

module.exports = Express;
