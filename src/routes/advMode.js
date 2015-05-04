// Neo4j REST variables
var host = 'localhost', port = 7474;

var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var connection;
var winston = require('winston');

var lastReq = "";

/* GET advMode page */
router.get('/advModeEcho', function (req, res, next) {
	res.render('advModeEcho', {title: 'Advanced Mode Data'});
});

router.post('/advMode', function(req,res,next) {
  var target = req.query.target;

  var data = {
      query: target,
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
							//Log this failed advanced mode interaction
							var usname = atob(auth.pw).split(":")[0];
							winston.info('AdvMode (fail): ' +target, { user: usname } );
              res.send({err:"Cannot communicate with Neo4j database."});							
          } else {
							//Log this successful advanced mode interaction
							var usname = atob(auth.pw).split(":")[0];
							winston.info('AdvMode (success): ' +target, { user: usname } );

              results = JSON.parse(results);
              var str = JSON.stringify(results, null, 2); // spacing level = 2
              var str1 = '\n\n<pre>\n<code class="prettyprint">\n';
              var str2 = '\n</pre>\n</code>\n';
              res.send("\n"+target+str1+str+str2);
          }
      });
  }).on('error', function (err) {
      console.log(err);
      res.send({err:"Cannot communicate with Neo4j database."});
  });



  req.write(JSON.stringify(data));
  req.end();
  /*db.query(target, function (err, results) {
      if (err) {
          console.log(err);
          res.send({err:"Cannot communicate with Neo4j database."});
      } else {
          var str = JSON.stringify(results, null, 2); // spacing level = 2
          var str1 = '<pre>\n<code class="prettyprint">\n';
          var str2 = '\n</pre>\n</code>\n';
          res.send(str1+str+str2);
      }
  });*/
});

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
