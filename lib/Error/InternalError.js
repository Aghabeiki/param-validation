const PVError = require('./PVError');

class InternalError extends PVError {
    constructor() {
        super("Internal Error.");
    }


}

module.exports = InternalError;