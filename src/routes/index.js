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

/* GET home page. */
router.post('/addNode', function(req, res, next) {
	var postData = "";
	req.addListener('data', function (chunk) {
		postData += chunk;
	});
	req.addListener('end', function () {
		postData = JSON.parse(postData);
		var node = db.createNode(postData.properties);
		node.save(function (err) {
			if (err) {
				res.write(err.message);
				res.end();
			} else {
				graph(req,res);
			}
		});
	});
});

/* Delete a node from the Neo4j DB */
router.post('/deleteNode', function(req, res, next) { 
	var node_id = req.body.id
	//query to delete node and all connected relationships
	var query = "START n=node(" + node_id + ") MATCH (n) - [r] - () DELETE n,r";
	db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Node deleted...")
		}
	});

});

/* Delete a relationship from the Neo4j DB */
router.post('/deleteRelationship', function(req, res, next) { 
	var rel_id = req.body.id
	//query to delete node and all connected relationships
	var query = "START r=rel(" + rel_id + ") DELETE r";
	db.query(query, null, function (err, results) {
		if (err) { // if error send blank response
			res.send({err:"Cannot communicate with Neo4j database."});
		} else {
			res.send("Node deleted...")
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
				res.write("Cannot communicate with Neo4j database.")
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

module.exports = router;
