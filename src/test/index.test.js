var request = require('supertest');
var assert = require('assert');

var node1_id;
var node2_id;
var rel_id;

var auth = {
	pw: 'bmVvNGo6cGlsbGFnZQ==',
	host: 'localhost',
	port: '7474',
	isHttps: false
};

describe('index.js', function () {
    before(function () {

    });

    describe('Routing', function () {

        it('should return an error - addNode', function (done) {
            request('http://localhost:8080').post('/addNode').send({label:'Test', data:"{}{}{}{Five}", auth:JSON.stringify(auth)}).end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

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

        it('should return an error - create relationship', function (done) {
            request('http://localhost:8080').post('/addRel')
            .send({startNode: node1_id, endNode : node2_id, type: { name: 'Test'}, auth:JSON.stringify(auth)})
            .end( function (err, res) {
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

        it('should return an error - updating node', function (done) {
            var data = {
                node : JSON.stringify({
                    node: JSON.stringify({
                        id: 'undefined',
                        data: {name : 'Test'}
                    })
                }),
                auth : JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/updateNode')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should update a node', function (done) {
            var data = {
                node : JSON.stringify({
                    node: JSON.stringify({
                        id: node1_id,
                        data: {name : 'Test'}
                    })
                }),
                auth : JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/updateNode')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should get a node\'s neigbors', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getNeighbors/' + node1_id).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - getNeighbors with bad id', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getNeighbors/' + -1).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should return an error - updating relationship', function (done) {
            var data = {
                rel : JSON.stringify({
                    rel: JSON.stringify({id: 'undefined', data:{name : 'Test'}})
                }),
                auth: JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/updateRel')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                assert.equal("Cannot communicate with Neo4j database.", JSON.parse(res.text).err);
                done();
            });
        });

        it('should update a relationship', function (done) {
            var data = {
                rel : JSON.stringify({
                    rel: JSON.stringify({id: rel_id, data:{name : 'Test'}})
                }),
                auth: JSON.stringify(auth)
            };
            request('http://localhost:8080').post('/updateRel')
            .send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - getting node by id', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getNode/undefined').send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should get a node by id', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getNode/' + node1_id).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should return an error - getting relationship by id', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getRel/undefined').send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should get a relationship by id', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getRel/' + rel_id).send(data)
            .end( function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });


        it('should return an error - deleting relationship', function (done) {
            request('http://localhost:8080').post('/deleteRelationship').send({ rel:JSON.stringify({id: 'undefined'}), auth: JSON.stringify(auth) }).end( function (err, res) {
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

        it('should return an error - deleting node', function (done) {
            request('http://localhost:8080').post('/deleteNode').send({ node:JSON.stringify({id: 'undefined'}), auth: JSON.stringify(auth) }).end( function (err, res) {
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

        it('should return 200 - get labels', function (done) {
            var data = {
        		auth: JSON.stringify(auth)
        	};
            request('http://localhost:8080').post('/getLabels').send(data).end(function (err, res) {
                assert.equal(200, res.statusCode);
                done();
            });
        });

    });

    after(function() {

    });
});
