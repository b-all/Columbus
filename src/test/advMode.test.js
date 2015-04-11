var request = require('supertest');
var assert = require('assert');

var auth = {
	pw: 'bmVvNGo6cGlsbGFnZQ==',
	host: 'localhost',
	port: '7474',
	isHttps: false
};

describe('advMode.js', function () {
	before(function () {

	});

	describe('Advanced Mode', function () {

		var data = {
			auth: JSON.stringify(auth)
		};

        it('should return 200 - advMode valid query', function (done) {
            var uri = '/advMode?target=MATCH%20n%20RETURN%20count(n)';
            request('http://localhost:8080').post(uri).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - advMode invalid query', function (done) {
            var uri = '/advMode?target=testtesttest';
            request('http://localhost:8080').post(uri).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

	});

	after(function() {

	});
});
