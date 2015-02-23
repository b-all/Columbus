// require neo4j Rest client
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var express = require('express');
var router = express.Router();

var nodesFound = 0;

router.get('/advMode', function(req,res,next) {
  var target = req.query.target;
  console.log(req.query.target);
  db.query(target, function (err, results) {
      if (err) {
          console.log(err);
          res.send({err:"Cannot communicate with Neo4j database."});
      } else {
          res.send(results);
      }
  });
});

module.exports = router;
