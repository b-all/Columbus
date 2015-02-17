// require neo4j Rest client
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var express = require('express');
var router = express.Router();

var nodesFound = 0;

router.get('/search', function(req,res,next) {
    var target = req.query.target;
    console.log(req.query.target);
    db.query('MATCH n RETURN n', function (err, results) {
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
                    data: nodes[k].n._data.data
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
    });
});

function getAllNodeRelationships(nodes, callback) {
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

    db.query(q, null, function(err, results) {
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
                    data: results[i].r._data.data
                });
            }

            callback(relationships);

        }
    });
}

function getNodesBasedOnRelationships (edges, callback) {
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

    db.query(q, null, function(err, results) {
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
                    data: results[k].n._data.data
                });

            }

            callback(nodeArray);

        }
    });

}

module.exports = router;
