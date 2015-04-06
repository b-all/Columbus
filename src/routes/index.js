// Neo4j REST variables
var host = 'localhost', port = 7474;


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Columbus' });
});

/* GET all nodes from neo4j database */
router.post('/graph', function(req, res, next) {
	//query all nodes in db
	var data = {
		query: 'MATCH (n) RETURN n LIMIT 100',
		params: {}
	};

	var auth = req.body;
	isHTTPS(auth.isHttps);

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				var nodeArray = [];
				for (var i = 0; i < results.data.length; i++) {
					nodeArray.push({
						title: results.data[i][0].metadata.id.toString(),
						id: results.data[i][0].metadata.id,
						x: 0,
						y: 0,
						labels: results.data[i][0].metadata.labels,
						data: results.data[i][0].data,
						filtered: true
					});

				}
				var relationshipArray = getAllRelationships(req, res, nodeArray, auth, function (relationshipArray) {
					var graph = {
						nodes: nodeArray,
						relationships: relationshipArray
					};
					// send graph data back to client
					res.send(JSON.stringify(graph));
				});
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
});

/* add a node to the neo4j database */
router.post('/addNode', function(req, res, next) {
	var query = "";
	if (typeof req.body.data !== 'undefined') {
		query = 'CREATE (n:' + req.body.label + ' ' +
					CleanJSONForNeo4j(req.body.data) + ')' +
					'RETURN id(n)';
	} else {
		query = 'CREATE (n:' + req.body.label + ')' +
					'RETURN id(n)';
	}

	//query all nodes in db
	var data = {
		query: query,
		params: {}
	};

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				res.send(results);
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
});

/* add a relationship to the neo4j database */
router.post('/addRel', function(req, res, next) {
	var query = (typeof req.body.data !== 'undefined') ?
	 				'START n=node(' + req.body.startNode + '),' +
	 				'p=node(' + req.body.endNode + ')' +
					'CREATE (n) - [r:'+ req.body.type + ' ' +
					CleanJSONForNeo4j(req.body.data) + '] -> (p) RETURN id(r)' :
					'START n=node(' + req.body.startNode + '),' +
					'p=node(' + req.body.endNode + ')' +
					'CREATE (n) - [r:'+ req.body.type + '] -> (p) RETURN id(r)';

	//query all nodes in db
	var data = {
		query: query,
		params: {}
	};

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				res.send(results);
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
});

/* Delete a node from the Neo4j DB */
router.post('/deleteNode', function(req, res, next) {
	var node_id = JSON.parse(req.body.node).id;
	//query to delete all connected relationships
	var query = "START n=node(" + node_id + ") MATCH (n) - [r] - () DELETE r";

	//query all nodes in db
	var data1 = {
		query: query,
		params: {}
	};

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req1 = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				//query to delete the node
				var query2 = "START n=node(" + node_id +") DELETE n";
				var data2 = {
					query: query2,
					params: {}
				};
				var req2 = connection.request({
						hostname: auth.host,
						port: auth.port,
						path: '/db/data/cypher',
						method: 'POST',
						headers: headers
				}, function (response) {
					var results = '';
					response.on('data', function (chunk) {
						results += chunk;
					});
					response.on('end', function () {
						if (response.statusCode !== 200) { // if error send blank response
							res.send({err:"Cannot communicate with Neo4j database."});
						} else {
							results = JSON.parse(results);
							//query to delete the node
							var query2 = "START n=node(" + node_id +") DELETE n";
							res.send(results);
						}
					});
				}).on('error', function (err) {
				    console.log(err);
					res.send({err:"Cannot communicate with Neo4j database."});
				});
				req2.write(JSON.stringify(data2));
				req2.end();
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req1.write(JSON.stringify(data1));
	req1.end();
	/*db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			//query to delete the node
			var query2 = "START n=node(" + node_id +") DELETE n";
			db.query(query2, null, function (err, results) {
				if (err) {
					console.log(err);
					res.send({err:"Cannot communicate with Neo4j database."});
				} else {
					res.send("Node deleted...");
				}
			});
		}
	});*/

});

/* Delete a relationship from the Neo4j DB */
router.post('/deleteRelationship', function(req, res, next) {
	var rel_id = JSON.parse(req.body.rel).id;
	//query to delete node and all connected relationships
	var query = "START r=rel(" + rel_id + ") DELETE r";
	//query all nodes in db
	var data = {
		query: query,
		params: {}
	};

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				res.send("Relationship deleted...");
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Relationship deleted...");
		}
	});*/

});

/* Update a node in the Neo4j DB*/
router.post('/updateNode', function(req, res, next) {
	var data = JSON.parse(req.body.node);
	data = JSON.parse(data.node);

	var node_id = data.id;
	var properties = data.data;
	//query to delete node and all connected relationships
	var query = "START n=node(" + node_id + ") SET n = " + CleanJSONForNeo4j(JSON.stringify(properties)) ;

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	//query all nodes in db
	var data = {
		query: query,
		params: {}
	};

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				res.send("Node updated...");
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Node updated...");
		}
	});*/

});

/* Update a relationship in the Neo4j DB*/
router.post('/updateRel', function(req, res, next) {
	var data = JSON.parse(req.body.rel);
	data = JSON.parse(data.rel);

	var rel_id = data.id;
	var properties = data.data;
	//query to delete node and all connected relationships
	var query = "START r=rel(" + rel_id + ") SET r = " + CleanJSONForNeo4j(JSON.stringify(properties)) ;

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	//query all nodes in db
	var data = {
		query: query,
		params: {}
	};

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				res.send("Relationship updated...");
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Relationship updated...");
		}
	});*/

});

/* Get a single node by id */
router.post('/getNode/:id', function(req,res,next) {
	var id = req.params.id;
	var q = 'START n=node('+ id +') RETURN n';

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	//query all nodes in db
	var data = {
		query: q,
		params: {}
	};

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				var nodeArray = [];
				for (var i = 0; i < results.data.length; i++) {
					nodeArray.push({
						title: results.data[i][0].metadata.id.toString(),
						id: results.data[i][0].metadata.id,
						x: 0,
						y: 0,
						labels: results.data[i][0].metadata.labels,
						data: results.data[i][0].data,
						filtered: true
					});

				}
				res.send(nodeArray);
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*db.query(q, null, function(err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			var nodeArray = [];
			for (var i = 0; i < results.length; i++) {
				nodeArray.push({
					title: results[i].n._data.metadata.id.toString(),
					id: results[i].n._data.metadata.id,
					x: 0,
					y: 0,
					labels: results[i].n._data.metadata.labels,
					data: results[i].n._data.data,
					filtered: true
				});

			}
			res.send(nodeArray);
		}
	});*/
});

/* Get a single relationship by id */
router.post('/getRel/:id', function(req,res,next) {
	var id = req.params.id;
	var q = 'START r=rel('+ id +') RETURN r';

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	//query all nodes in db
	var data = {
		query: q,
		params: {}
	};

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				var relArray = [];
				for (var i = 0; i < results.data.length; i++) {
					var startNodeURI = results.data[i][0].start.split("/");
					var endNodeURI = results.data[i][0].end.split("/");
					relArray.push({
						source: parseInt(startNodeURI[startNodeURI.length - 1]),
						target: parseInt(endNodeURI[endNodeURI.length - 1]),
						id: results.data[i][0].metadata.id,
						type: results.data[i][0].metadata.type,
						data: results.data[i][0].data,
						filtered: true
					});
				}
				res.send(relArray);
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*db.query(q, null, function(err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			var relArray = [];
			for (var i = 0; i < results.length; i++) {
				var startNodeURI = results[i].r._data.start.split("/");
				var endNodeURI = results[i].r._data.end.split("/");
				relArray.push({
					source: parseInt(startNodeURI[startNodeURI.length - 1]),
					target: parseInt(endNodeURI[endNodeURI.length - 1]),
					id: results[i].r._data.metadata.id,
					type: results[i].r._data.metadata.type,
					data: results[i].r._data.data,
					filtered: true
				});
			}
			res.send(relArray);
		}
	});*/
});

/* Get all labels in the database */
router.post('/getLabels', function (req, res, next) {
	var q = 'MATCH n RETURN distinct labels(n)';

	//query all nodes in db
	var data = {
		query: q,
		params: {}
	};

	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				var labelArray = [];
				for (var i = 0; i < results.data.length; i++) {
					var found = false;
					for (var j = 0; j < labelArray.length; j++) {
						if (labelArray[j] === results.data[i][0][0]) {
							found = true;
						}
					}
					if (!found) {
						labelArray.push(results.data[i][0][0]);
					}
				}
				res.send(labelArray);
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*db.query(q, null, function (err, results){
		if (err) {
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			var labelArray = [];
			for (var i = 0; i < results.length; i++) {
				var found = false;
				for (var j = 0; j < labelArray.length; j++) {
					if (labelArray[j] === results[i]['labels(n)'][0]) {
						found = true;
					}
				}
				if (!found) {
					labelArray.push(results[i]['labels(n)'][0]);
				}
			}
			res.send(labelArray);
		}
	});*/

});

/* Get all neighbors of a single node */
router.post('/getNeighbors/:id', function(req,res,next) {
	var id = req.params.id;
	var auth = JSON.parse(req.body.auth);
	isHTTPS(auth.isHttps);
	// query to get nodes connected to the id provided
	var q_nodes = 'START p=node('+ id +') MATCH (p) - [] - (n) RETURN distinct n';
	// query to get the node of the id provided
	//var q_thisNode = 'START n=node('+ id +') RETURN n';
	// query to get the relationships of the id provided
	var q_rels = 'START n=node('+ id +') MATCH (n) - [r] - () RETURN distinct r';

	//query all nodes in db
	var data1 = {
		query: q_nodes,
		params: {}
	};

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req1 = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			if (response.statusCode !== 200) { // if error send blank response
				res.send({err:"Cannot communicate with Neo4j database."});
			} else {
				results = JSON.parse(results);
				var nodeArray = [];
				for (var i = 0; i < results.data.length; i++) {
					nodeArray.push({
						title: results.data[i][0].metadata.id.toString(),
						id: results.data[i][0].metadata.id,
						x: 0,
						y: 0,
						labels: results.data[i][0].metadata.labels,
						data: results.data[i][0].data,
						filtered: true
					});
				}
				var data2 = {
					query: q_rels,
					params: {}
				};
				var req2 = connection.request({
						hostname: auth.host,
						port: auth.port,
						path: '/db/data/cypher',
						method: 'POST',
						headers: headers
				}, function (response) {
					var results = '';
					response.on('data', function (chunk) {
						results += chunk;
					});
					response.on('end', function () {
						if (response.statusCode !== 200) { // if error send blank response
							res.send({err:"Cannot communicate with Neo4j database."});
						} else {
							results = JSON.parse(results);
							var relArray = [];

							for (var i = 0; i < results.data.length; i++) {
								var startNodeURI = results.data[i][0].start.split("/");
								var endNodeURI = results.data[i][0].end.split("/");
								relArray.push({
									source: parseInt(startNodeURI[startNodeURI.length - 1]),
									target: parseInt(endNodeURI[endNodeURI.length - 1]),
									id: results.data[i][0].metadata.id,
									type: results.data[i][0].metadata.type,
									data: results.data[i][0].data,
									filtered: true
								});
							}

							var graph = {
								nodes: nodeArray,
								relationships: relArray
							};
							// send graph data back to client
							res.send(JSON.stringify(graph));
						}
					});
				}).on('error', function (err) {
				    console.log(err);
					res.send({err:"Cannot communicate with Neo4j database."});
				});
				req2.write(JSON.stringify(data2));
				req2.end();
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req1.write(JSON.stringify(data1));
	req1.end();

	/*db.query(q_nodes, null, function(err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			var nodeArray = [];
			for (var i = 0; i < results.data.length; i++) {
				nodeArray.push({
					title: results[i].n._data.metadata.id.toString(),
					id: results[i].n._data.metadata.id,
					x: 0,
					y: 0,
					labels: results[i].n._data.metadata.labels,
					data: results[i].n._data.data,
					filtered: true
				});

			}
			db.query(q_rels, null, function(err, results) {
				if (err) { // if error send blank response
					console.log(err);
					res.send({err:"Cannot communicate with Neo4j database."});
				} else {
					var relArray = [];

					for (var i = 0; i < results.data.length; i++) {
						var startNodeURI = results[i].r._data.start.split("/");
						var endNodeURI = results[i].r._data.end.split("/");
						relArray.push({
							source: parseInt(startNodeURI[startNodeURI.length - 1]),
							target: parseInt(endNodeURI[endNodeURI.length - 1]),
							id: results[i].r._data.metadata.id,
							type: results[i].r._data.metadata.type,
							data: results[i].r._data.data,
							filtered: true
						});
					}

					var graph = {
						nodes: nodeArray,
						relationships: relArray
					};
					// send graph data back to client
					res.send(JSON.stringify(graph));
				}
			});
		}
	});*/
});


function getAllRelationships(req, res, nodes, auth, callback) {
	//query all nodes in db
	var data = {
		query: 'START r=rel(*) RETURN r LIMIT 100',
		params: {}
	};

	var headers = {
		'Content-Type':'application/json',
		'Authorization': auth.pw
	};

	var req = connection.request({
			hostname: auth.host,
			port: auth.port,
			path: '/db/data/cypher',
			method: 'POST',
			headers: headers
	}, function (response) {
		var results = '';
		response.on('data', function (chunk) {
			results += chunk;
		});
		response.on('end', function () {
			results = JSON.parse(results);
			if (typeof results !== 'undefined') {
				if (response.statusCode !== 200) { // if error send blank response
					res.write("Cannot communicate with Neo4j database.");
					res.end();
				} else {
					var relationships = [];
					for (var i = 0; i < results.data.length; i++) {
						var startNodeURI = results.data[i][0].start.split("/");
						var endNodeURI = results.data[i][0].end.split("/");
						relationships.push({
							source: parseInt(startNodeURI[startNodeURI.length - 1]),
							target: parseInt(endNodeURI[endNodeURI.length - 1]),
							id: results.data[i][0].metadata.id,
							type: results.data[i][0].metadata.type,
							data: results.data[i][0].data,
							filtered: true
						});
					}

					callback(relationships);
				}
			}
		});
	}).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

	req.write(JSON.stringify(data));
	req.end();
	/*//query all relationships in db
	var query = 'START r=rel(*) RETURN r LIMIT 100';

	// send query to database
	db.query(query, null, function(err, results) {
		if (typeof results !== 'undefined') {
			if (err) { // if error send blank response
				res.write("Cannot communicate with Neo4j database.");
				res.end();
			} else {
				var relationships = [];
				for (var i = 0; i < results.length; i++) {
					var startNodeURI = results[i].r._data.start.split("/");
					var endNodeURI = results[i].r._data.end.split("/");
					relationships.push({
						source: parseInt(startNodeURI[startNodeURI.length - 1]),
						target: parseInt(endNodeURI[endNodeURI.length - 1]),
						id: results[i].r._data.metadata.id,
						type: results[i].r._data.metadata.type,
						data: results[i].r._data.data,
						filtered: true
					});
				}

				callback(relationships);
			}
		}
	});*/
}



function isHTTPS(isHttps) {
	isHttps = (isHttps === 'true') ? true : false;
	if (isHttps) {
		delete connection;
		connection = require('https');
		return true;
	} else {
		delete connection;
		connection = require('http');
		return false;
	}
}

function CleanJSONForNeo4j(json) {
    return json.replace(/"(\w+)"\s*:/g, '$1:');
}

module.exports = router;
