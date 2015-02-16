var server = require("../app");
var request = require('supertest');
var assert = require('assert');

describe('app', function () {
	before(function () {

	});

	describe('Basic Server Operations', function () {

		it('should return 200 for /', function (done) {
			request('http://localhost:8080').get('/').end( function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

		it('should return 200 - accessing public files', function (done) {
			request('http://localhost:8080').get('/scripts/Displays/displayMain.js').end( function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

		it('should return 200 - talking to neo4j database', function (done) {
			request('http://localhost:8080').get('/graph').end( function (err, res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});


		it('should not return database communication error', function (done) {
			request('http://localhost:8080').get('/graph').end(function (err, res) {
				assert.equal(200, res.statusCode);
				assert.notEqual("Cannot communicate with Neo4j database.", res.body.err);
				done();
			});
		});

		it('should return a 404 error', function (done) {
			request('http://localhost:8080').get('/error.jpeg').end(function (err, res) {
				assert.equal(404, res.statusCode);
				done();
			});
		});

		it('should return a 500 error', function (done) {
			var data = {rel : {id: 22, data:{name : 'Test'}}};
			request('http://localhost:8080').post('/updateRel')
			.send(data)
			.end( function (err, res) {
				assert.equal(500, res.statusCode);
				done();
			});
		});

	});

	after(function() {

	});
});
