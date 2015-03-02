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
          var str = JSON.stringify(results, null, 2); // spacing level = 2
          var str1 = '<pre>\n<code class="prettyprint">\n';
          var str2 = '\n</pre>\n</code>\n';
          res.send(str1+str+str2);
      }
  });
});

module.exports = router;
