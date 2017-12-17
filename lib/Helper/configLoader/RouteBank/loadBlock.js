/**
 * Created by roten on 11/17/17.
 */
'use strict';

module.exports = (JSONObject) => {
  const bank = {};
  let theURL = JSONObject.URL.toLowerCase();
  if (theURL[theURL.length - 1] === '/' && theURL.length !== 1) {
    theURL = theURL.slice(0, theURL.length - 1);
  }
  bank[theURL] = {};
  bank[theURL][JSONObject.METHOD.toLowerCase()] = JSONObject;
  return bank;
};
