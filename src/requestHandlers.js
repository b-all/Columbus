var jade = require("jade");
var fs = require("fs");
var path = require("path");

// routes to home page
function start(req, res) {

	// convert from jade to html
	var html = jade.renderFile('./src/public/views/index.jade');

	// send the converted web page to the client
	res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
	res.write(html);
	res.end();
}

// retrieves files from the server's public folder
function webroot(req, res, pathname) {
	var relative_path = './src/public' + pathname;
	// if the path exists and the path specifies a file
	if (fs.existsSync( relative_path ) && fs.lstatSync( relative_path ).isFile() ) {
		// read the file
		var file = fs.readFileSync( relative_path );
		// add appropriate headers to files
		if (path.extname(pathname) === '.js') {
			res.writeHead(200, {"Content-Type" : 'application/javascript'});
		} else if (path.extname(pathname) === '.css') {
			res.writeHead(200, {"Content-Type" : 'text/css'});
		} else if (path.extname(pathname) === '.xsl') {
			res.writeHead(200, {"Content-Type" : 'text/xsl'});
		} else if (path.extname(pathname) === '.xml') {
			res.writeHead(200, {"Content-Type" : 'text/xml'});
		}
		
		// send files to the client
		res.write(file);
		res.end();
	} else {
		res.write('404 - Not Found');
		res.end();
	}
	
}

/*
---------------------------------------------------
the following are calls to the neo4j db and should
probably be defined in a separate module 
eventually
---------------------------------------------------
*/

var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase('http://localhost:7474');

// pulls neo4j data
function graph(req, res) {
	//query all nodes in db
	var query = 'MATCH (n) RETURN n'; 

	// send query to database 
	db.query(query, null, function(err, results) {
		if (err) { // if error send blank response
			res.write("Cannot communicate with Neo4j database.");
			res.end();
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
				res.write(JSON.stringify(graph));
				res.end();
			});

			
		}
	});
}

function addNode(req, res) {
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
}

function getAllRelationships(req, res, nodes, callback) {
	//query all relationships in db
	var query = 'START r=rel(*) RETURN r'; 

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
						target: parseInt(endNodeURI[endNodeURI.length - 1])
					});
				}
				
				callback(relationships);
			}
		}
	});
}


// export all functions so that they can be used by other modules
exports.start = start; 
exports.webroot = webroot;
exports.graph = graph;
exports.addNode = addNode; 
