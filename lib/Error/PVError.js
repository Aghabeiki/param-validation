/**
 * Created by roten on 11/17/17.
 */

let Handler = null;
const _details = new WeakMap();
class PVError extends Error {

    constructor(...args) {
        if (args === undefined || (Array.isArray(args) && args.length == 0))
            super();
        else {
            super(args);
        }
        Handler = this;
        _details.set(Handler, null);
    }

    setDetails(errorDetails) {
        if (errorDetails.message === undefined || errorDetails.data === undefined) {
            throw new Error('invalid usage of PVError');
        }
        else {
            _details.set(Handler, errorDetails);
        }
        return this;
    }

    getDetails() {

        return _details.get(Handler);
    }
}

module.exports = PVError;