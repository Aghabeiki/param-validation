const validVerbs = ['get', 'post', 'put', 'patch', 'delete'];
const { InternalError} = require('../Error/index');

class AppRoutes {
    constructor() {
        this._routes = validVerbs.reduce((routes, verb) => {
            routes[verb] = [];
            return routes;
        }, {});
    }

    addTo(verb, path) {
        if (validVerbs.indexOf(verb) > -1) {
            if (this._routes[verb][path]) {
                throw new InternalError().setDetails({
                    message: 'A duplicate path and verb added to your routes.',
                    data: {
                        currentRoutes: this._routes,
                        newVerb: verb,
                        newPath: path
                    }
                });
            } else {
                this._routes[verb].push(path);
            }
        }
    }

    addToAllMethod(path) {
        const that = this;
        validVerbs.forEach(verb => {
            that.addTo(verb, path);
        });
    }

    processEndpoint(method, path) {
        if (Array.isArray(this._routes[method])) {
            if (this._routes[method][path]) {
                throw new InternalError.setDetails({
                    message: 'A duplicate path and verb added to your routes.',
                    data: {
                        currentRoutes: this._routes,
                        newVerb: verb,
                        newPath: path
                    }
                });
            } else {
                this._routes[method].push(path);
            }
        } else {
            throw new InternalError.setDetails({
                message: 'Invalid Method passed to AppRoutes.',
                data: {
                    invalidMethod: method
                }
            });
        }
    }

    get routes() {
        return this._routes;
    }
}

module.exports = AppRoutes;