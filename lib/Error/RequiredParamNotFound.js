/**
 * Created by roten on 11/20/17.
 */
const PVError = require('./PVError');
class RequiredParamNotFound extends PVError {
    constructor() {
        super("A required param missed in your request.")
    }
}
module.exports = RequiredParamNotFound;