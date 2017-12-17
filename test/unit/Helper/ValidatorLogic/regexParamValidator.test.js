/**
 * Created by roten on 11/20/17.
 */

'use strict';

const regexParamValidator = require('../../../../lib/Helper/validator-logic/regexParamValidator');
const PVError = require('../../../../lib/Error/index');
describe('#regexParamValidator', () => {
  it('-should pass value validation', () => {
    const res = regexParamValidator({regex64: 'KD89LileXCQ/KChbMS05XVswLTldezAsMn0oL' +
    'FswLTldezN9KSopfDApPyhcLlswLTldezEsMn0pPyQ='}, 14.60);
    should(res).be.ok();
  });
  it('-should fail value validation', () => {
    const res = regexParamValidator({regex64: 'KD89LileXCQ/KChbMS05XVswLTldezAsMn0oL' +
    'FswLTldezN9KSopfDApPyhcLlswLTldezEsMn0pPyQ='}, '14.');
    should(res).not.be.ok();
  });
  it('-should skipp value validation due undefined regex', () => {
    should(regexParamValidator({}, 'test')).be.ok();
  });
  it('-should throw an error.', (done) => {
    let error = null;
    try {
      regexParamValidator({regex64: null}, 15.4);
    } catch (err) {
      error = err;
    } finally {
      if (!error) {
        done(new Error('This unit test dose not throw an error.'));
      } else if (error instanceof PVError) {
        done();
      } else {
        done(new Error('This unit throw an invalid Error.'));
      }
    }
  });
});
