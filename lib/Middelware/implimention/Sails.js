/**
 * Created by roten on 11/17/17.
 */

const BaseMiddleware = require('../BaseMiddelware');
const AppRoutes = require('../../Helper/AppRoutes');
const {PVError, InternalError} = require('../../Error');

class Sails extends BaseMiddleware {


    loadAppRouteConfig(app) {
        let appRoutes = new AppRoutes();
        if (app.constructor.name === 'Sails' && app.config.routes !== undefined) {
            Object.keys(app.config.routes).forEach(endPoint => {
                const path = endPoint.split(' ');

                // Check the route verb is presented or not.
                if (path.length === 2) {
                    // Process the verb and path with route class.
                    appRoutes.processEndpoint(path[0], path[1]);
                } else {
                    // If a verb not presented for the current route,
                    // it mean the sails add the target route for all verbs.
                    appRoutes.addToAllMethod(path[0]);
                }
            });
            return appRoutes.routes;
        } else {
            throw new InternalError().setDetails({message: "The passed app is not sails.", data: app});
        }

    }

    /**
     *
     * @param req
     * @returns {{url: string, method: string, params: {queryString: Array, body: Array, headers: Array}}}
     *
     */
    requestParser(req) {
        const method = req.method;
        const [url, queryPart] = req.url.split('?');
        let queryString = null;
        if (queryPart) {
            const QueryString = require('querystring');
            queryString = QueryString.parse(queryPart);
        }
        const UrlPatterns = require('url-pattern');
        const finedURL = Object.keys(this.context.routeConfig).filter((url) => {
            return !this.context.routeConfig[url][method];
        }).map(finedURL => {
            const urlPatterns = new UrlPatterns(finedURL);
            return {url: url, keyURL: finedURL, extractedData: urlPatterns.match(url)};
        }).filter(matchedData => {
            return matchedData.extractedData
        })

        if (finedURL.length !== 1) {
            throw new InternalError().setDetails({
                message: "The URL in request not match with any of our routeConfig.",
                data: {
                    routeConfig: this.context.routeConfig,
                    requestedURL: req.url,
                    requestedMethod: req.method
                }
            })
        }
        return {
            url: url,
            method: method,
            ruleKey: finedURL[0].keyURL,
            params: {
                queryString: queryString || null,
                path: finedURL[0].extractedData || null,
                body: req.body || null,
                headers: req.headers || null
            }
        }

    }

    validator(req, res, next) {
        let error = null;
        try {
            // Check if the URL is excluded from param validator-logic skipp it.
            if (this.context.moduleConfig.excludePrefix !== null) {
                let rg = new RegExp(this.context.moduleConfig.excludePrefix, 'i');

                if (rg.test(req.url.toLowerCase())) {
                    return next()
                }
            }

            // Get request information.
            let reqInfo = this.requestParser(req);

            let rule = this.findRule(reqInfo.ruleKey, reqInfo.method);

            // Run the rule on params.

            /**
             * We have 4 parts to check .
             * - Body params.
             * - Header params.
             * - In Path params.
             * - Query String params.
             */

            // Check the body params.
            if (rule.BODY) {
                try {
                    this.ruleExecutor(rule.BODY, reqInfo.params.body);
                }
                catch (error) {
                    if (error instanceof PVError) {
                        throw error;
                    }
                    else {
                        throw new InternalError()
                            .setDetails({
                                message: error.message,
                                data: error
                            })
                    }
                }
            }
            // Check the Header params.
            if (rule.HEADER) {
                try {
                    this.ruleExecutor(rule.HEADER, reqInfo.params.path);
                }
                catch (error) {
                    if (error instanceof PVError) {
                        throw error;
                    }
                    else {
                        throw new InternalError()
                            .setDetails({
                                message: error.message,
                                data: error
                            })
                    }
                }
            }
            // Check the in Path params.
            if (rule.InPath) {
                try {
                    this.ruleExecutor(rule.InPath, reqInfo.params.path);
                }
                catch (error) {
                    if (error instanceof PVError) {
                        throw error;
                    }
                    else {
                        throw new InternalError()
                            .setDetails({
                                message: error.message,
                                data: error
                            })
                    }
                }
            }
            // Check the query string params.
            if (rule.QueryParam) {
                try {
                    this.ruleExecutor(rule.QueryParam, reqInfo.params.queryString);
                }
                catch (error) {
                    if (error instanceof PVError) {
                        throw error;
                    }
                    else {
                        throw new InternalError()
                            .setDetails({
                                message: error.message,
                                data: error
                            })
                    }
                }
            }

        }
        catch (err) {

            if (err instanceof PVError) {
                error = err;
            }
            else {
                error = new InternalError()
                    .setDetails({
                        message: err.message,
                        data: err
                    })
            }
        }
        finally {
            if (!error) {
                // Param validation passed.
                next();
            }
            else {
                res.status(400).json({error_code: 0, error_message: error.message, error_details: error.getDetails()});
            }

        }
    }
}

module.exports = Sails;
