var request = require('supertest');
var assert = require('assert');

var auth = {
	pw: 'bmVvNGo6cGlsbGFnZQ==',
	host: 'localhost',
	port: '7474',
	isHttps: false
};

var node1_id;
var node2_id;
var rel_id;


describe('search.js', function () {
	before(function () {

	});

	describe('Shortest Path', function () {
        it('should create a node', function (done) {
            request('http://localhost:8080').post('/addNode').send({ label: 'Test', data: "{name: \"Test\"}", auth:JSON.stringify(auth) }).end( function (err, res) {
                node1_id = JSON.parse(res.text).data[0][0];
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should create a node', function (done) {
            request('http://localhost:8080').post('/addNode').send({ label: 'Test', auth:JSON.stringify(auth) }).end( function (err, res) {
                node2_id = JSON.parse(res.text).data[0][0];
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return 200 - valid shortest path request (no results)', function (done) {
            var data = {
                auth: JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/getShortestPath/' + node1_id + '/' + node2_id).send(data)
            .end(function(err,res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return 404 - invalid shortest path request', function (done) {
            var data = {
                auth: JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/getShortestPath/undefined/undefined').send(data)
            .end(function(err,res) {
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should create a relationship', function (done) {
            request('http://localhost:8080').post('/addRel')
            .send({startNode: node1_id, endNode : node2_id, type: 'Test',  auth:JSON.stringify(auth)})
            .end( function (err, res) {
                rel_id = JSON.parse(res.text).data[0][0];
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return 200 - valid shortest path request', function (done) {
            var data = {
                auth: JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/getShortestPath/' + node1_id + '/' + node2_id).send(data)
            .end(function(err,res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should delete a relationship', function (done) {
            request('http://localhost:8080').post('/deleteRelationship').send({ rel:JSON.stringify({id: rel_id}), auth: JSON.stringify(auth) }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should delete a node', function (done) {
            request('http://localhost:8080').post('/deleteNode').send({ node:JSON.stringify({id: node1_id}), auth: JSON.stringify(auth) }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should delete a node', function (done) {
            request('http://localhost:8080').post('/deleteNode').send({ node:JSON.stringify({id: node2_id}), auth: JSON.stringify(auth) }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

	});

	after(function() {

	});
});
