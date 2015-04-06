var currentRequest;
var auth = {
	pw: '',
	host: '',
	port: '',
	isHttps: false
};

function pullGraph(callback) {
	 var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = width/2 - 300,
        yLoc = 200;

	currentRequest = $.post('graph', auth).done(function (data) {
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
		data = { data: JSON.stringify(data), label: label, auth: JSON.stringify(auth)};
	} else {
		data = { label: label, auth: JSON.stringify(auth)};
	}

	currentRequest = $.post('addNode', data).done(function (data) {
		if (!data.err) {
			callback(data.data[0][0]);
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
				endNode: endNode,
				auth: JSON.stringify(auth)
			};
	} else {
		data =
			{
				type: type,
				startNode: startNode,
				endNode: endNode,
				auth: JSON.stringify(auth)
			};
	}


	currentRequest = $.post('addRel', data).done(function (data) {
		if (!data.err) {
			callback(data.data[0][0]);
			toastSuccess("Relationship Created");
		} else {
			toastFail("There was an error communicating with the server");
		}
	});
}

function requestDeleteNode(node, callback) {
	var alert = new Alert();
	var data = {
		node: JSON.stringify(node),
		auth: JSON.stringify(auth)
	};
	alert.confirm("Are you sure you want to delete this node?", function (confirmed) {
		if (confirmed) {
			$.ajax({
				url : 'deleteNode',
				type : 'POST',
				data : data
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
	});


}

function requestDeleteRelationship(rel, callback) {
	var alert = new Alert();
	var data = {
		rel: JSON.stringify(rel),
		auth: JSON.stringify(auth)
	};
	alert.confirm("Are you sure you want to delete this relationship?", function (confirmed) {
		if (confirmed) {
			$.ajax({
				url : 'deleteRelationship',
				type : 'POST',
				data : data
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
	});
}

function updateNodeProperties(node, callback) {
	var data = {
		node: JSON.stringify(node),
		auth: JSON.stringify(auth)
	};
	currentRequest = $.post('updateNode', data).done(function (data) {
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
	var data = {
		rel: JSON.stringify(rel),
		auth: JSON.stringify(auth)
	};
	currentRequest = $.post('updateRel', data).done(function (data) {
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
	var data = {
		auth: JSON.stringify(auth)
	};
	currentRequest = $.post('getNode/' + nodeId, data).done(function(data) {
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
	var data = {
		auth: JSON.stringify(auth)
	};
	currentRequest = $.post('getRel/' + relId, data).done(function(data) {
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

function searchWhere(prop, val, callback) {
	var where = {
		prop: prop,
		val: val
	}
	var data = {
		auth: JSON.stringify(auth),
		where: JSON.stringify(where)
	};

	currentRequest = $.post('searchWhere', data).done(function(data) {
		if (!data.err) {
			if ($('#additiveSearchCheckbox').prop("checked")){
				var dataCopy = JSON.parse(JSON.stringify(data));
				graph.addNodeNeighbors(data);
				currentData.nodes = currentData.nodes.concat(dataCopy.nodes).unique();
				currentData.relationships = currentData.relationships.concat(dataCopy.relationships);
			} else {
				displayData(data);
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

function search(target, callback) {
	if (typeof target === 'undefined' || target === '') {
		pullGraph();
		return;
	}

	var obj = { target: target, auth: JSON.stringify(auth) };

	currentRequest = $.post('search', obj).done(function(data) {
		if (!data.err) {

			if ($('#additiveSearchCheckbox').prop("checked")){
				var dataCopy = JSON.parse(JSON.stringify(data));
				graph.addNodeNeighbors(data);
				currentData.nodes = currentData.nodes.concat(dataCopy.nodes).unique();
				currentData.relationships = currentData.relationships.concat(dataCopy.relationships);
			} else {
				displayData(data);
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
	var data = {
		auth: JSON.stringify(auth)
	};
	$.post('getLabels', data).done(function(data) {
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
	var data = {
		auth: JSON.stringify(auth)
	};
	if (selected !== null) {
		var id = selected.id;
		toggleAnimateGetNeighborsIcon();
		$.post('getNeighbors/' + id, data).done(function (data) {
			toggleAnimateGetNeighborsIcon();
			if(!data.err) {
				var docEl = document.documentElement,
			        bodyEl = document.getElementsByTagName('body')[0];

			    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
			        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

			    var xLoc = 0,
			        yLoc = 0;
				var dataCopy = JSON.parse(data);
				graph.addNodeNeighbors(JSON.parse(data));

				currentData.nodes = currentData.nodes.concat(dataCopy.nodes).unique();
				currentData.relationships = currentData.relationships.concat(dataCopy.relationships).unique();

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

function getShortestPath(startNodeId, endNodeId, callback) {
	toggleAnimateShortestPathIcon();
	if (startNodeId === '' || endNodeId === '') {
		toastFail('You must enter a starting node and ending node');
		toggleAnimateShortestPathIcon();
		return;
	}
	var data = {
		auth: JSON.stringify(auth)
	};
	currentRequest = $.post('getShortestPath/' + startNodeId + '/' + endNodeId, data).done(function(data) {
		toggleAnimateShortestPathIcon();
		if (!data.err) {
			if(data.nodes.length !== 0) {
				displayData(data);
			} else {
				toastFail("No Shortest Path Results Found");
			}

			callback(data);
		} else {
			console.log(data.err);
			toastFail("There was an error communicating with the server");
		}
	}).fail(function(msg) {
		toggleAnimateShortestPathIcon();
		toastFail("There was an error communicating with the server");
		console.log(msg);
	});


}

function advMode(target, callback) {

	if (typeof target === 'undefined' || target === '') {
		console.log('Empty query string');
		return;
	}

	var data = {
		auth: JSON.stringify(auth)
	};

	var obj = { target: target, auth: JSON.stringify(auth) };
	$.post('advMode?target=' + target, data).done(function (data) {
		localStorage.advModeData = JSON.stringify(data);
		console.log(localStorage.advModeData);
		var win = window.open(getBaseURL()+'advModeEcho');
	}).fail(function () {
		toastFail("There was an error communicating with the server");
	});
}

function getPropertyKeys(callback) {
	var data = {
		auth: JSON.stringify(auth)
	};

	$.post('getPropertyKeys', data).done(function (data) {
		callback(data);
	}).fail(function () {
		toastFail("There was an error communicating with the server");
	});
}


/*******************************************************
 *  Functions that do not interact with the server
 *
 *******************************************************/

function getBaseURL () {
	return location.protocol + "//" + location.hostname +
			(location.port && ":" + location.port) + "/";
}

function displayData (data) {
	var docEl = document.documentElement,
		bodyEl = document.getElementsByTagName('body')[0];

	var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
		height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

	var xLoc = 0,
		yLoc = 0;
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
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
