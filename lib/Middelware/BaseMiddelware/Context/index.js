/**
 * Created by roten on 11/17/17.
 */
let _contextHandler = null;
// private properties;
const _appRoutes = new WeakMap();
const _routeConfig = new WeakMap();
const moduleConfig = new WeakMap();
class Context {

    constructor(appRoutes, routeConfig, moduleConfig) {
        _contextHandler = this;
        _contextHandler.appRoutes = appRoutes;
        _contextHandler.routeConfig = routeConfig;
        _contextHandler.moduleConfig = moduleConfig
    }


    get appRoutes() {
        return _appRoutes.get(_contextHandler);
    }

    set appRoutes(value) {
        _appRoutes.set(_contextHandler, value);
    }

    get routeConfig() {
        return _routeConfig.get(_contextHandler);
    }

    set routeConfig(value) {
        _routeConfig.set(_contextHandler, value);
    }

    get moduleConfig() {
        return moduleConfig.get(_contextHandler);
    }

    set moduleConfig(value) {
        moduleConfig.set(_contextHandler, value);
    }
}
module.exports = Context;