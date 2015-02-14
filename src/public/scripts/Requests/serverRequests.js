function pullGraph(callback) {
	 var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = width/2 - 300,
        yLoc = 200;
	$.get('graph').done(function (data) {
		if (data.err) {
			toastFail("Cannot communicate with Neo4j database.");
			return;
		}
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
	if (!data.hasOwnProperty("")) {
		data = { data: JSON.stringify(data), label: label};
	} else {
		data = { label: label};
	}

	$.post('addNode', data).done(function (data) {
		if (!data.err) {
			callback(data[0]['id(n)']);
			toastSuccess("Node Created");
		} else {
			toastFail("There was an error communicating with the server");
		}
	});
}

function createRel(data, type, startNode, endNode, callback) {
	if (!validateRelationship(type, startNode, endNode)) {
		return;
	}
	if (hasProperties(data)) {
		data =
			{
				data: JSON.stringify(data),
				type: type,
				startNode: startNode,
				endNode: endNode
			};
	} else {
		data =
			{
				type: type,
				startNode: startNode,
				endNode: endNode
			};
	}


	$.post('addRel', data).done(function (data) {
		if (!data.err) {
			callback(data[0]['id(r)']);
			toastSuccess("Relationship Created");
		} else {
			toastFail("There was an error communicating with the server");
		}
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
			toastFail("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		toastFail("There was an error communicating with the server");
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
			toastFail("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});
}

function updateNodeProperties(node, callback) {
	$.post('updateNode', node).done(function (data) {
		if (!data.err) {
			toastSuccess("Properties Updated");
			callback();
		} else {
			console.log(data.err);
			toastFail("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});
}

function updateRelProperties(rel, callback) {
	$.post('updateRel', rel).done(function (data) {
		if (!data.err) {
			toastSuccess("Properties Updated");
			callback();
		} else {
			console.log(data.err);
			toastFail("There was an error communicating with the server");
		}
	}).fail(function (msg) {
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});
}

function getSingleNode(nodeId, callback) {
	$.get('getNode/' + nodeId).done(function(data) {
		if (!data.err) {
			callback(data);
		} else {
			console.log(data.err);
			toastFail("There was an error communicating with the server");
		}
	}).fail(function(msg) {
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});
}

function getSingleRel(relId, callback) {
	$.get('getRel/' + relId).done(function(data) {
		if (!data.err) {
			callback(data);
		} else {
			console.log(data.err);
			toastFail("There was an error communicating with the server");
		}
	}).fail(function(msg) {
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});
}

function search(target, callback) {
	var docEl = document.documentElement,
	bodyEl = document.getElementsByTagName('body')[0];

	var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
	height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

	var xLoc = width/2 - 300,
		yLoc = 200;

	if (typeof target === 'undefined' || target === '') {
		pullGraph();
		return;
	}

	var obj = { target: target };

	$.get('search', obj).done(function(data) {
		if (!data.err) {
			displayForceData(data, xLoc, yLoc, width, height);
			callback();
		} else {
			console.log(data.err);
			toastFail("There was an error communicating with the server");
		}
	}).fail(function(msg) {
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});
}
