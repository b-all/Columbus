/* run index.js to start the web server
 *	 
 * Author: Taylor Deckard (stdeckar)
 */

var server = require("./app");
var router = require("./router");
var requestHandlers = require("./requestHandlers")

// handle is an array of functions for handling requests
var handle = [];
handle[""] = requestHandlers.start;
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
// webroot requests ask for files from the server's public folder
handle["/webroot"] = requestHandlers.webroot;
// a graph request gets data from neo4j
handle["/graph"] = requestHandlers.graph;
// add a node to the neo4j database
handle["/addNode"] = requestHandlers.addNode; 
// runs the start function in app.js
server.start(router.route, handle);