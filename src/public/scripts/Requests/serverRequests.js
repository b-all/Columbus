function pullGraph(callback) {
	 var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = width/2 - 300,
        yLoc = 200;
	$.get('graph').done(function (data) {
		data = JSON.parse(data);
		if (typeof callback !== 'undefined') {
			callback(data, xLoc, yLoc, width, height);
		} else {
			displayForceData(data, xLoc, yLoc, width, height);
		}
		return data;
	});
}

function addNode(data) {
	var data = JSON.stringify({properties: {name:'Jane Doe'}, label: 'Person'});
	$.post('addNode', data).done(function (data) {
		console.log(data)
		pullGraph();
	});
}

function requestDeleteNode(node, callback) {
	$.post('deleteNode', node).done(function(data){
		if (!data.err) {
			callback();
		} else {
			alert("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		alert("There was an error communicating with the server");
		console.log(msg);
	});
	
}

function requestDeleteRelationship(rel, callback) {
	$.post('deleteRelationship', rel).done(function(data){
		if (!data.err) {
			callback();
		} else {
			alert("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		alert("There was an error communicating with the server");
		console.log(msg);
	});
}