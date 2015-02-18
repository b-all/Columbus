var hoverInfoOn = false;
$(document).ready(function() {
    "use strict";

    $('.navArrowContainer').on('click', function() {
        if (showingSideMenu) {
            hideSideMenu('default');
        } else {
            showSideMenu('default');
        }
    });

    $(document).keydown(function (e){
        if (e.keyCode === 46 && !editingProperties) {
            e.preventDefault();
        }
    });

    $(document).mousemove(function (event){
        if (isHovering) {
            $('.nodeDataHover').css({ 'left' : event.clientX + 10,
                            'top' : event.clientY + 10});

    $("#devModeInput").keyup(function (e) {
        if (e.keyCode === 13) {
            var target = $('#devModeInput').val();
            console.log(target);
            // search(target, function () {
            //
            // });
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

function toggleInfoOnHover() {
    hoverInfoOn = !hoverInfoOn;
    if (!hoverInfoOn) {
        $('#hoverInfoBtn').removeClass('btn-primary');
        $('#hoverInfoBtn').addClass('btn-success');
        $('.nodeDataHover').hide();
        toastInfo("Hover info turned off.");
    } else {
        $('#hoverInfoBtn').addClass('btn-primary');
        $('#hoverInfoBtn').removeClass('btn-success');
        toastInfo("Hover info turned on.");
    }
}
