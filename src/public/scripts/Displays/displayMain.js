$(document).ready(function() {
    "use strict";

    /**** MAIN ****/

    /*/ warn the user when leaving
    window.onbeforeunload = function(){
      return "Make sure to save your graph locally before leaving";
    };*/      

    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = 0,
        yLoc = 0;

    //var edges = initialGraph.relationships;


    var nodes, edges;
    pullGraph(displayForceData);
});

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

function addNode() {
	var data = JSON.stringify({properties: {name:'Jane Doe'}, label: 'Person'});
	$.post('addNode', data).done(function (data) {
		console.log(data)
		pullGraph();
	});
}

$(document).ready(function() {
	$('.navArrowContainer').on('click', function() {
		if (showingSideMenu) {
			hideSideMenu('default');
		} else {
			showSideMenu('default');
		}
	});
});


function getEdges(graph) {

}

function getNodes(graph) {

}
