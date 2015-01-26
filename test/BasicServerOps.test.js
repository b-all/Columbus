var server = require("../src/app");
var router = require("../src/router");
var requestHandlers = require("../src/requestHandlers")
var http = require('http');
var assert = require('assert');

describe('app', function () {
	before(function () {
		var handle = [];
		handle[""] = requestHandlers.start;
		handle["/"] = requestHandlers.start;
		handle["/start"] = requestHandlers.start;
		handle["/webroot"] = requestHandlers.webroot;
		handle["/graph"] = requestHandlers.graph;
		handle["/addNode"] = requestHandlers.addNode; 
		server.start(router.route, handle);
	});

	describe('Basic Server Operations', function () {

		it('should return 200 for /', function (done) {
			http.get('http://localhost:8888/', function (res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

		it('should return 200 - accessing public files', function (done) {
			http.get('http://localhost:8888/scripts/main.js', function (res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});

		it('should return 200 - talking to neo4j database', function (done) {
			http.get('http://localhost:8888/graph', function (res) {
				assert.equal(200, res.statusCode);
				done();
			});
		});


		it('should not return database communication error', function (done) {
			http.get('http://localhost:8888/graph', function (res) {
				assert.equal(200, res.statusCode);
				var body = "";
				res.on('data', function(chunk) {
					body += chunk;
				});

				res.on('end', function () {
					assert.notEqual("Cannot communicate with Neo4j database.", body);
					done();
				})
			});
		});

	});

	after(function() {
		server.stop();
	});
});