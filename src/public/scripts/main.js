function pullGraph(callback) {
	$.get('graph').done(function (data) {
		data = JSON.parse(data);
		callback(data);
		return data;
	});
}

function addNode() {
	var data = JSON.stringify({properties: {name:'Jane Doe'}, label: 'Person'});
	$.post('addNode', data).done(function (data) {
		console.log(data)
	});
}

function getEdges(graph) {

}

function getNodes(graph) {

}
