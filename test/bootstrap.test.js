'use strict';
const should=require('should'); // eslint-disable-line no-unused-vars
/**
 * @description use for validation on any method that should throw something special.
 * @param {function} func the method that should test.
 * @param {Error} errorType Error data type that should thrown.
 * @param {function }afterIt extra validation on thrown error.
 */
global.validateError = function(func, errorType, afterIt) {
  const NOT_THROWN_ERROR_STRING_TAG='Function dose not throw any error.';
  try {
    func();
    throw new Error(NOT_THROWN_ERROR_STRING_TAG);
  } catch (err) {
    if (err instanceof errorType) {
      afterIt(err);
    } else if ( err instanceof Error) {
      if ( err.message === NOT_THROWN_ERROR_STRING_TAG) {
        throw err;
      } else {
        throw new Error('Invalid Error Thrown.');
      }
    }
  }
};

before(()=>{
  global.shouldJS=should;
});
