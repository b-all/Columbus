$(document).ready(function() {
    "use strict";

    $('.navArrowContainer').on('click', function() {
        if (showingSideMenu) {
            hideSideMenu('default');
        } else {
            showSideMenu('default');
        }
    });

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


function getEdges(graph) {

}

function getNodes(graph) {

}
