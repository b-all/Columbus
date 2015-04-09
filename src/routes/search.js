// Neo4j REST variables
var host = 'localhost', port = 7474;

var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var connection;

var nodesFound = 0;

router.post('/getPropertyKeys', function(req,res,next) {
    var auth = JSON.parse(req.body.auth);
    isHTTPS(auth.isHttps);

    var headers = {
        'Content-Type':'application/json',
        'Authorization': auth.pw
    };

    var req = connection.request({
            hostname: auth.host,
            port: auth.port,
            path: '/db/data/propertykeys',
            method: 'GET',
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

    req.end();

});

router.post('/searchWhere', function(req,res,next) {
    var auth = JSON.parse(req.body.auth);
    isHTTPS(auth.isHttps);
    var where = JSON.parse(req.body.where);
    var headers = {
        'Content-Type':'application/json',
        'Authorization': auth.pw
    };

    var data = {
        query: 'MATCH n WHERE n.' + where.prop + '=~ "(?i).*' + where.val + '.*"' +  ' RETURN n',
        params: {}
    };

    console.log(data.query);

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
                var nodes = results.data;
                var nodeArray = [];
                for (var k = 0; k < nodes.length; k++) {
                    nodeArray.push({
                        title: nodes[k][0].metadata.id.toString(),
                        id: nodes[k][0].metadata.id,
                        x: 0,
                        y: 0,
                        labels: nodes[k][0].metadata.labels,
                        data: nodes[k][0].data,
    					filtered: true
                    });

                }
                nodesFound = nodeArray.length;
                if (nodesFound > 1000) {
                    res.send({err:"Too many results."});
                    return;
                }
                if (nodeArray.length > 0) {
                    getAllNodeRelationships(nodeArray, auth, function (relationshipArray) {
                        getNodesBasedOnRelationships(relationshipArray, auth, function (relNodes) {
                            var graph = {
                                nodes: (relNodes.length !== 0) ? relNodes: nodeArray,
                                relationships: relationshipArray,
                                matches: nodesFound
                            };
                            res.send(graph);
                        });
                    });
                } else {
                    res.send({err:"No matching results."});
                    return;
                }
            }
        });
    }).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

    req.write(JSON.stringify(data));
    req.end();
});

router.post('/search', function(req,res,next) {
    var target = req.body.target;
    console.log('Searched for \'' + req.body.target + '\'');

    var data = {
        query: 'MATCH n RETURN n',
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
                var nodes = results.data;
                // iterate over all nodes in db
                for (var i = 0; i < nodes.length; i++) {
                    var found = false;
                    // iterate over node data
                    for(var j in nodes[i][0].data) {
                        if (typeof nodes[i][0].data[j] !== 'undefined') {
                            if (nodes[i][0].data[j].toString().toLowerCase().indexOf(target.toLowerCase()) !== -1) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        nodes.splice(i, 1);
                        i--;
                    }
                }
                var nodeArray = [];
                for (var k = 0; k < nodes.length; k++) {
                    nodeArray.push({
                        title: nodes[k][0].metadata.id.toString(),
                        id: nodes[k][0].metadata.id,
                        x: 0,
                        y: 0,
                        labels: nodes[k][0].metadata.labels,
                        data: nodes[k][0].data,
    					filtered: true
                    });

                }
                nodesFound = nodeArray.length;
                if (nodesFound > 1000) {
                    res.send({err:"Too many results."});
                    return;
                }
                if (nodeArray.length > 0) {
                    getAllNodeRelationships(nodeArray, auth, function (relationshipArray) {
                        getNodesBasedOnRelationships(relationshipArray, auth, function (relNodes) {
                            var graph = {
                                nodes: (relNodes.length !== 0) ? relNodes: nodeArray,
                                relationships: relationshipArray,
                                matches: nodesFound
                            };
                            res.send(graph);
                        });
                    });
                } else {
                    res.send({err:"No matching results."});
                    return;
                }
            }
        });
    }).on('error', function (err) {
	    console.log(err);
		res.send({err:"Cannot communicate with Neo4j database."});
	});

    req.write(JSON.stringify(data));
    req.end();

    /*db.query('MATCH n RETURN n', function (err, results) {
        if (err) {
            console.log(err);
            res.send({err:"Cannot communicate with Neo4j database."});
        } else {
            var nodes = results;
            // iterate over all nodes in db
            for (var i = 0; i < nodes.length; i++) {
                var found = false;
                // iterate over node data
                for(var j in nodes[i].n.data) {
                    if (typeof nodes[i].n.data[j] !== 'undefined') {
                        if (nodes[i].n.data[j].toString().toLowerCase().indexOf(target.toLowerCase()) !== -1) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    nodes.splice(i, 1);
                    i--;
                }
            }
            var nodeArray = [];
            for (var k = 0; k < nodes.length; k++) {
                nodeArray.push({
                    title: nodes[k].n._data.metadata.id.toString(),
                    id: nodes[k].n._data.metadata.id,
                    x: 0,
                    y: 0,
                    labels: nodes[k].n._data.metadata.labels,
                    data: nodes[k].n._data.data,
					filtered: true
                });

            }
            nodesFound = nodeArray.length;
            if (nodesFound > 1000) {
                res.send({err:"Too many results."});
                return;
            }
            if (nodeArray.length > 0) {
                getAllNodeRelationships(nodeArray, function (relationshipArray) {
                    getNodesBasedOnRelationships(relationshipArray, function (relNodes) {
                        var graph = {
                            nodes: (relNodes.length !== 0) ? relNodes: nodeArray,
                            relationships: relationshipArray,
                            matches: nodesFound
                        };
                        res.send(graph);
                    });
                });
            } else {
                res.send({err:"No matching results."});
                return;
            }


        }
    });*/
});

function getAllNodeRelationships(nodes, auth, callback) {
    if (nodes.length === 0) {
        callback([]);
    }
    var q = 'START n=node(';
    for (var i = 0; i < nodes.length; i++) {
        if (i === nodes.length -1) {
            q += ' ' + nodes[i].id;
        } else {
            q += ' ' + nodes[i].id + ',';
        }
    }
    q += ') MATCH (n)-[r]-() RETURN r';

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
            return;
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
    });*/
}

function getNodesBasedOnRelationships (edges, auth, callback) {
    if (edges.length === 0) {
        callback([]);
    }
    var q = 'START n=node(';
    var nodeIDs = [];
    for(var i = 0; i < edges.length; i++) {
        var foundSource = false;
        var foundTarget = false;
        for (var j = 0; j < nodeIDs.length; j++) {
            if (nodeIDs[j] === edges[i].source) {
                foundSource = true;
            }
            if (nodeIDs[j] === edges[i].target) {
                foundTarget = true;
            }
        }
        if (!foundSource) {
            nodeIDs.push(edges[i].source);
        }
        if (!foundTarget) {
            nodeIDs.push(edges[i].target);
        }
    }
    for(var k = 0; k < nodeIDs.length; k++) {
        if (k === nodeIDs.length - 1) {
            q += ' ' + nodeIDs[k];
        } else {
            q += ' ' + nodeIDs[k] + ',';
        }
    }

    q += ') RETURN n';

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
                for (var k = 0; k < results.data.length; k++) {
                    nodeArray.push({
                        title: results.data[k][0].metadata.id.toString(),
                        id: results.data[k][0].metadata.id,
                        x: 0,
                        y: 0,
                        labels: results.data[k][0].metadata.labels,
                        data: results.data[k][0].data,
    					filtered: true
                    });

                }

                callback(nodeArray);
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
            return;
        } else {
            var nodeArray = [];
            for (var k = 0; k < results.length; k++) {
                nodeArray.push({
                    title: results[k].n._data.metadata.id.toString(),
                    id: results[k].n._data.metadata.id,
                    x: 0,
                    y: 0,
                    labels: results[k].n._data.metadata.labels,
                    data: results[k].n._data.data,
					filtered: true
                });

            }

            callback(nodeArray);

        }
    });*/

}

function isHTTPS(isHttps) {
    isHttps = (isHttps === 'true') ? true : false;
	if (isHttps) {
		connection = https;
		return true;
	} else {
		connection = http;
		return false;
	}
}

module.exports = router;
