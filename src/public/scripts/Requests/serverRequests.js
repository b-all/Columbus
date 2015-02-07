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

function createNode(data, label, callback) {
	data = { data: JSON.stringify(data), label: label};
	$.post('addNode', data).done(function (data) {
		console.log('Node Created');
		callback(data[0]['id(n)']);
	});
}

function requestDeleteNode(node, callback) {
	$.ajax({
		url : 'deleteNode',
		type : 'DELETE',
		data : node
	}).done(function (data) {
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
	$.ajax({
		url : 'deleteRelationship',
		type : 'DELETE',
		data : rel
	}).done(function(data){
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

function updateNodeProperties(node, callback) {
	console.log(node);
	$.post('updateNode', node).done(function (data) {
		if (!data.err) {
			callback();
		} else {
			console.log(data.err);
			alert("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		alert("There was an error communicating with the server");
		console.log(msg);
	});
}

function getSingleNode(nodeId, callback) {
	$.get('getNode/' + nodeId).done(function(data) {
		callback(data);
	}).fail(function(msg) {
		alert("There was an error communicating with the server");
		console.log(msg);
	});
}
