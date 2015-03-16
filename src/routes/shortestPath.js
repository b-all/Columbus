// require neo4j Rest client
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var express = require('express');
var router = express.Router();

router.get('/getShortestPath/:startId/:endId', function(req,res,next) {
  var startNodeId = req.params.startId;
  var endNodeId = req.params.endId;
  var q = 'START n=node(' + startNodeId + '), p=node(' + endNodeId + ')'+
        'MATCH n,p,q = allShortestPaths((n)-[*]-(p))'+
        ' RETURN nodes(q), rels(q)';
    db.query(q, function (err, results) {
        if (err) {
            console.log(err);
            res.send({err:"Cannot communicate with Neo4j database."});
        } else {
            var nodes = [], rels =[];
            results.forEach(function (iVal, i, iArray) {
                if (iArray[i].hasOwnProperty('nodes(q)')) {
                    iArray[i]['nodes(q)'].forEach(function (jVal, j, jArray) {
                        var weHaveThatNodeAlready = false;
                        nodes.forEach(function (kVal, k, kArray) {
                            if (kArray[k].id === jArray[j]._data.metadata.id) {
                                weHaveThatNodeAlready = true;
                            }
                        });
                        if (!weHaveThatNodeAlready) {
                            nodes.push({
                                title: jArray[j]._data.metadata.id.toString(),
                                id: jArray[j]._data.metadata.id,
                                x: 0,
                                y: 0,
                                labels: jArray[j]._data.metadata.labels,
                                data: jArray[j]._data.data,
            					filtered: true
                            });
                        }
                    });
                }
                if (iArray[i].hasOwnProperty('rels(q)')) {
                    iArray[i]['rels(q)'].forEach(function (jVal, j, jArray) {
                        var weHaveThatRelAlready = false;
                        rels.forEach(function (kVal, k, kArray) {
                            if (kArray[k].id === jArray[j]._data.metadata.id) {
                                weHaveThatRelAlready = true;
                            }
                        });
                        if (!weHaveThatRelAlready) {
                            var startNodeURI = jArray[j]._data.start.split("/");
                            var endNodeURI = jArray[j]._data.end.split("/");
                            rels.push({
                                source: parseInt(startNodeURI[startNodeURI.length - 1]),
                                target: parseInt(endNodeURI[endNodeURI.length - 1]),
                                id: jArray[j]._data.metadata.id,
                                type: jArray[j]._data.metadata.type,
                                data: jArray[j]._data.data,
                                filtered: true
                            });
                        }
                    });
                }
            });
            var graph = {
                nodes: nodes,
                relationships: rels
            };
            res.send(graph);
        }
    });
});

module.exports = router;
