/**
 * Created by roten on 11/20/17.
 */

const PVError = require('./PVError');
class RequestedParamIsNotValid extends PVError {
    constructor() {
        super("Requested param is not valid");
    }


}

module.exports = RequestedParamIsNotValid;