// Neo4j REST variables
var host = 'localhost', port = 7474;

var express = require('express');
var router = express.Router();
var http = require('http');

router.post('/getShortestPath/:startId/:endId', function(req,res,next) {
    var startNodeId = req.params.startId;
    var endNodeId = req.params.endId;
    var q = 'START n=node(' + startNodeId + '), p=node(' + endNodeId + ')'+
        'MATCH n,p,q = allShortestPaths((n)-[*]-(p))'+
        ' RETURN nodes(q), rels(q)';

    var data = {
        query: q,
        params: {}
    };

    var auth = JSON.parse(req.body.auth);

    var headers = {
        'Content-Type':'application/json',
        'Authorization': auth.pw
    };

    var req = http.request({
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
                console.log(results);
                results = JSON.parse(results);

                var nodes = [], rels =[];
                results.data.forEach(function (iVal, i, iArray) {
                        iArray[i][0].forEach(function (jVal, j, jArray) {
                            var weHaveThatNodeAlready = false;
                            nodes.forEach(function (kVal, k, kArray) {
                                if (kArray[k].id === jArray[j].metadata.id) {
                                    weHaveThatNodeAlready = true;
                                }
                            });
                            if (!weHaveThatNodeAlready) {
                                nodes.push({
                                    title: jArray[j].metadata.id.toString(),
                                    id: jArray[j].metadata.id,
                                    x: 0,
                                    y: 0,
                                    labels: jArray[j].metadata.labels,
                                    data: jArray[j].data,
                					filtered: true
                                });
                            }
                        });

                        iArray[i][1].forEach(function (jVal, j, jArray) {
                            var weHaveThatRelAlready = false;
                            rels.forEach(function (kVal, k, kArray) {
                                if (kArray[k].id === jArray[j].metadata.id) {
                                    weHaveThatRelAlready = true;
                                }
                            });
                            if (!weHaveThatRelAlready) {
                                var startNodeURI = jArray[j].start.split("/");
                                var endNodeURI = jArray[j].end.split("/");
                                rels.push({
                                    source: parseInt(startNodeURI[startNodeURI.length - 1]),
                                    target: parseInt(endNodeURI[endNodeURI.length - 1]),
                                    id: jArray[j].metadata.id,
                                    type: jArray[j].metadata.type,
                                    data: jArray[j].data,
                                    filtered: true
                                });
                            }
                        });
                });
                var graph = {
                    nodes: nodes,
                    relationships: rels
                };
                res.send(graph);
            }
        });
    });

    req.write(JSON.stringify(data));
    req.end();

    /*db.query(q, function (err, results) {
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
    });*/
});

module.exports = router;
