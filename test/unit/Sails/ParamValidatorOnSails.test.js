/**
 * Created by roten on 11/19/17.
 */
const sails = require('sails');
const should = require('should');
const request = require('supertest');

describe('#Param Validator on Sails.', () => {
    "use strict";
    before(function (done) {

        const config = require('../../resources/sailsConfig')
        // Increase the Mocha timeout so that Sails has enough time to lift.
        this.timeout(5000);

        sails.lift(config, function (err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });


    it('Param Checking', (done) => {
        request(sails.hooks.http.app)
            .post('/?testInQuery=12')
            .send({
                bodyParam: 'test'
            })
            .expect(200)
            .then(response => {
                "use strict";
                response.res.text.should.be.eql('ok');
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    after(function (done) {
        // here you can clear fixtures, etc.
        sails.lower(done);
    });

})