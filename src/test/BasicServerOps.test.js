var server = require("../app");
var request = require('supertest');
var assert = require('assert');

describe('app', function () {
	before(function () {
		
	});

	describe('Basic Server Operations', function () {

		it('should return 200 for /', function (done) {
			request('http://localhost:8888').get('/').end( function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

		it('should return 200 - accessing public files', function (done) {
			request('http://localhost:8888').get('/scripts/Displays/displayMain.js').end( function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

		it('should return 200 - talking to neo4j database', function (done) {
			request('http://localhost:8888').get('/graph').end( function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});


		it('should not return database communication error', function (done) {
			request('http://localhost:8888').get('/graph').end(function (err, res) {
				assert.equal(200, res.statusCode);
				assert.notEqual("Cannot communicate with Neo4j database.", res.body.err);
				done();
			});
		});

	});

	after(function() {

	});
});