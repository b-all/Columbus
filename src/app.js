var http = require("http");
var url = require("url");
var fs = require("fs");
var util = require("util");
var webroot = './public';

var server;

//starts the web server
function start(route, handle) {

	// gets called when the server receives an http request
	var onRequest = function(req, res) {
		// parse the pathname from the request url
		var pathname = url.parse(req.url).pathname;

		// route the request in router.js
		route(handle, pathname, req, res);



	};

	// creates a web server listening on port 8888
	server = http.createServer(onRequest).listen(8888);

	console.log("Server has started...");
}

function stop() {
	server.close();
}

// export functions so that other modules can use them
exports.start = start;
exports.stop = stop;