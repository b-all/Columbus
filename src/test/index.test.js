var request = require('supertest');
var assert = require('assert');

var node1_id;
var node2_id;
var rel_id;

describe('index.js', function () {
    before(function () {

    });

    describe('Routing', function () {

        it('should return an error - addNode', function (done) {
            request('http://localhost:8080').post('/addNode').send({label:'Test', data:"{}{}{}{Five}"}).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should create a node', function (done) {
            request('http://localhost:8080').post('/addNode').send({ label: 'Test', data: "{name: \"Test\"}" }).end( function (err, res) {
                node1_id = JSON.parse(res.text)[0]["id(n)"];
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should create a node', function (done) {
            request('http://localhost:8080').post('/addNode').send({ label: 'Test' }).end( function (err, res) {
                node2_id = JSON.parse(res.text)[0]["id(n)"];
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - create relationship', function (done) {
            request('http://localhost:8080').post('/addRel')
            .send({startNode: node1_id, endNode : node2_id, type: { name: 'Test'}})
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should create a relationship', function (done) {
            request('http://localhost:8080').post('/addRel')
            .send({startNode: node1_id, endNode : node2_id, type: 'Test'})
            .end( function (err, res) {
                rel_id = JSON.parse(res.text)[0]["id(r)"];
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - updating node', function (done) {
            var data = {node : JSON.stringify({id: 'undefined', data:{name : 'Test'}})};
            request('http://localhost:8080').post('/updateNode')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should update a node', function (done) {
            var data = {node : JSON.stringify({id: node1_id, data:{name : 'Test'}})};
            request('http://localhost:8080').post('/updateNode')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should get a node\'s neigbors', function (done) {
            request('http://localhost:8080').get('/getNeighbors/' + node1_id)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - getNeighbors with bad id', function (done) {
            request('http://localhost:8080').get('/getNeighbors/' + -1)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should return an error - updating relationship', function (done) {
            var data = {rel : JSON.stringify({id: 'undefined', data:{name : 'Test'}})};
            request('http://localhost:8080').post('/updateRel')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should update a relationship', function (done) {
            var data = {rel : JSON.stringify({id: rel_id, data:{name : 'Test'}})};
            request('http://localhost:8080').post('/updateRel')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - getting node by id', function (done) {
            request('http://localhost:8080').get('/getNode/undefined')
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should get a node by id', function (done) {
            request('http://localhost:8080').get('/getNode/' + node1_id)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - getting relationship by id', function (done) {
            request('http://localhost:8080').get('/getRel/undefined')
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should get a relationship by id', function (done) {
            request('http://localhost:8080').get('/getRel/' + rel_id)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });


        it('should return an error - deleting relationship', function (done) {
            request('http://localhost:8080').delete('/deleteRelationship').send({ id: 'undefined' }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should delete a relationship', function (done) {
            request('http://localhost:8080').delete('/deleteRelationship').send({ id: rel_id }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - deleting node', function (done) {
            request('http://localhost:8080').delete('/deleteNode').send({ id: 'undefined' }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should delete a node', function (done) {
            request('http://localhost:8080').delete('/deleteNode').send({ id: node1_id }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should delete a node', function (done) {
            request('http://localhost:8080').delete('/deleteNode').send({ id: node2_id }).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return 200 - get labels', function (done) {
            request('http://localhost:8080').get('/getLabels').end(function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

    });

    after(function() {

    });
});
