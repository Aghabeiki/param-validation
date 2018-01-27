/**
 * Created by roten on 11/17/17.
 */
'use strict';

const BaseMiddleware = require('../BaseMiddelware');
const getRoutes = require('get-routes');
const {InternalError} = require('../../Error');

/**
 * @description A Express.js friendly Param Validator Middleware implementation.
 * @todo Implement this parts.
 */
class Express extends BaseMiddleware {
  /**
   * loadAppRouteConfig
   *  @description overwriten loadAppRouteConfig to match Sails for loading getRouter
   * @param {Object} app Sails App.
   * @return {JSON} json paramValidator Middleware config.;
   */
  loadAppRouteConfig(app) {
    let results=null;
    try {
      results=getRoutes(app);
    } catch (err) {
      new InternalError().setDetails({
        message: err.message,
        data: err,
      });
    }
    return results;
  }

  /**
   *
   * @param {Object} req a valid sails request.
   * @return {{url: string, method: string, params: {queryString: Array, body: Array, headers: Array}}}
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
      // Filter all rules that match to our HTTP method.
      return this.context.routeConfig[url][method.toLowerCase()];
    }).map((finedURL) => {
      const urlPatterns = new UrlPatterns(finedURL);
      return {url: url, keyURL: finedURL, extractedData: urlPatterns.match(url.toLowerCase())};
    }).filter((matchedData) => {
      return matchedData.extractedData;
    }).filter((matchedURL)=>{
      const tmpURL=Object.keys(matchedURL.extractedData).reduce((tmpURL, inPathParam)=>{
        return tmpURL.replace(new RegExp('\\b'+inPathParam+'\\b'), matchedURL.extractedData[inPathParam]);
      }, matchedURL.keyURL)
        .split('/(:').join('/') // Remove /(: extra characters.
        .split('(/:').join('/') // Remove (/: extra characters.
        .split(')').join('') // Remove )   extra characters.
        .split('/:').join('/'); // Remove /:  extra characters.
      return tmpURL.toLowerCase()=== url.toLowerCase();
    });

    if (finedURL.length !== 1) {
      throw new InternalError().setDetails({
        message: 'The URL in request not match with any of our routeConfig.',
        data: {
          routeConfig: this.context.routeConfig,
          requestedURL: req.url,
          requestedMethod: req.method,
        },
      });
    }
    return {
      url: url,
      method: method,
      ruleKey: finedURL[0].keyURL,
      params: {
        queryString: queryString || null,
        path: finedURL[0].extractedData || null,
        body: req.body || null,
        headers: req.headers || null,
      },
    };
  }
}

module.exports = Express;
