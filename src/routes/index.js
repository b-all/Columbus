// require neo4j Rest client
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Columbus' });
});

/* GET all nodes from neo4j database */
router.get('/graph', function(req, res, next) {
	//query all nodes in db
	var query = 'MATCH (n) RETURN n LIMIT 100';

	// send query to database
	db.query(query, null, function(err, results) {
		if (err) { // if error send blank response
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
					data: results[i].n._data.data
				});

			}
			var relationshipArray = getAllRelationships(req, res, nodeArray, function (relationshipArray) {
				var graph = {
					nodes: nodeArray,
					relationships: relationshipArray
				};
				// send graph data back to client
				res.send(JSON.stringify(graph));
			});


		}
	});
});

/* add a node to the neo4j database */
router.post('/addNode', function(req, res, next) {
	var query = 'CREATE (n:' + req.body.label + ' ' +
					CleanJSONForNeo4j(req.body.data) + ')' +
					'RETURN id(n)';

	db.query(query, null, function(err, results) {
		if (err) {
			console.log(err);
			res.send(err.message);
		} else {
			res.send(results);
		}
	});
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

	db.query(query, null, function(err, results) {
		if (err) {
			console.log(err);
			res.send(err.message);
		} else {
			res.send(results);
		}
	});
});

/* Delete a node from the Neo4j DB */
router.delete('/deleteNode', function(req, res, next) {
	var node_id = req.body.id;
	//query to delete all connected relationships
	var query = "START n=node(" + node_id + ") MATCH (n) - [r] - () DELETE r";
	db.query(query, null, function (err, results) {
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
	});

});

/* Delete a relationship from the Neo4j DB */
router.delete('/deleteRelationship', function(req, res, next) {
	var rel_id = req.body.id;
	//query to delete node and all connected relationships
	var query = "START r=rel(" + rel_id + ") DELETE r";
	db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Node deleted...");
		}
	});

});

/* Update a node in the Neo4j DB*/
router.post('/updateNode', function(req, res, next) {
	var data = JSON.parse(req.body.node);
	var node_id = data.id;
	var properties = data.data;
	//query to delete node and all connected relationships
	var query = "START n=node(" + node_id + ") SET n = " + CleanJSONForNeo4j(JSON.stringify(properties)) ;
	db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Node updated...");
		}
	});

});

/* Update a relationship in the Neo4j DB*/
router.post('/updateRel', function(req, res, next) {
	var data = JSON.parse(req.body.rel);
	var rel_id = data.id;
	var properties = data.data;
	//query to delete node and all connected relationships
	var query = "START r=rel(" + rel_id + ") SET r = " + CleanJSONForNeo4j(JSON.stringify(properties)) ;
	db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			console.log(err);
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Relationship updated...");
		}
	});

});

/* Get a single node by id */
router.get('/getNode/:id', function(req,res,next) {
	var id = req.params.id;
	var q = 'START n=node('+ id +') RETURN n';

	db.query(q, null, function(err, results) {
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
					data: results[i].n._data.data
				});

			}
			res.send(nodeArray);
		}
	});
});

/* Get a single relationship by id */
router.get('/getRel/:id', function(req,res,next) {
	var id = req.params.id;
	var q = 'START r=rel('+ id +') RETURN r';

	db.query(q, null, function(err, results) {
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
					data: results[i].r._data.data
				});
			}
			res.send(relArray);
		}
	});
});


function getAllRelationships(req, res, nodes, callback) {
	//query all relationships in db
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
						data: results[i].r._data.data
					});
				}

				callback(relationships);
			}
		}
	});
}

function CleanJSONForNeo4j(json) {
    return json.replace(/"(\w+)"\s*:/g, '$1:');
}

module.exports = router;
