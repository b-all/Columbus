var currentRequest;

function pullGraph(callback) {
	 var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = width/2 - 300,
        yLoc = 200;
		
	currentRequest = $.get('graph').done(function (data) {
		$('#loader').hide();
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

	currentRequest = $.post('addNode', data).done(function (data) {
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


	currentRequest = $.post('addRel', data).done(function (data) {
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
	currentRequest = $.post('updateNode', node).done(function (data) {
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
	currentRequest = $.post('updateRel', rel).done(function (data) {
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
	currentRequest = $.get('getNode/' + nodeId).done(function(data) {
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
	currentRequest = $.get('getRel/' + relId).done(function(data) {
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

	currentRequest = $.get('search', obj).done(function(data) {
		if (!data.err) {

			// check if preferences have been stored
		    if(typeof localStorage.columbusPreferences !== 'undefined') {
		        var prefs = JSON.parse(localStorage.getItem('columbusPreferences'));
		        if (prefs.graphVis === "Dynamic Force Graph") {
					displayForceData(data, xLoc, yLoc, width, height);
		        } else if (prefs.graphVis === "Stationary Force Graph") {
					displayStillData(data, xLoc, yLoc, width, height);
		        }
		    } else {
				displayForceData(data, xLoc, yLoc, width, height);
		    }

			callback(data.matches);
		} else {
			console.log(data.err);
			$('#loader').hide();
			toastFail(data.err);
		}
	}).fail(function(msg) {
		if (msg.statusText === 'abort') {
			toastInfo("Search Canceled");
		} else {
			toastFail("There was an error communicating with the server");
		}
		console.log(msg);
	});
}

function getAllLabels(callback) {
	$.get('getLabels').done(function(data) {
		if(!data.err) {
			callback(data);
		} else {
			console.log(data.err);
			toastFail(data.err);
		}
	}).fail(function(msg) {
		toastFail("There was an error communicating with the server");
	});
}

function getNeighbors () {
	var selected = graph.getSelectedNodeId();
	if (selected !== null) {
		var id = selected.id;
		toggleAnimateGetNeighborsIcon();
		$.get('getNeighbors/' + id).done(function (data) {
			toggleAnimateGetNeighborsIcon();
			if(!data.err) {
				var docEl = document.documentElement,
			        bodyEl = document.getElementsByTagName('body')[0];

			    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
			        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

			    var xLoc = 0,
			        yLoc = 0;
				graph.addNodeNeighbors(JSON.parse(data));

			} else {
				console.log(data.err);
				toastFail(data.err);
			}
		}).fail(function(msg) {
			toastFail("There was an error communicating with the server");
		});
	} else {
		toastFail("You must first select a node");
	}
}

function advMode(target, callback) {

	if (typeof target === 'undefined' || target === '') {
		console.log('Empty query string');
		return;
	}

	var obj = { target: target };

	var win = window.open(getBaseURL()+'advMode?target='+target);
	win.focus();
	// currentRequest = $.get('advMode', obj).done(function(data) {
	// 	if (!data.err) {
	// 		// displayForceData(data, xLoc, yLoc, width, height);
	//
	// 		callback(data);
	// 	} else {
	// 		console.log(data.err);
	// 		$('#loader').hide();
	// 		toastFail(data.err);
	// 	}
	// }).fail(function(msg) {
	// 	if (msg.statusText === 'abort') {
	// 		toastInfo("Search Canceled");
	// 	} else {
	// 		toastFail("There was an error communicating with the server");
	// 	}
	// 	console.log(msg);
	// });
}

function getBaseURL () {
	return location.protocol + "//" + location.hostname +
			(location.port && ":" + location.port) + "/";
}
