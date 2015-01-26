function pullGraph(callback) {
	 var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = width/2 - 25,
        yLoc = 300;
	$.get('graph').done(function (data) {
		data = JSON.parse(data);
		if (typeof callback !== 'undefined') {
			callback(data, xLoc, yLoc, width, height);
		} else {
			displayData(data, xLoc, yLoc, width, height);
		}
		return data;
	});
}

function addNode() {
	var data = JSON.stringify({properties: {name:'Jane Doe'}, label: 'Person'});
	$.post('addNode', data).done(function (data) {
		console.log(data)
		pullGraph();
	});
}

function getEdges(graph) {

}

function getNodes(graph) {

}
