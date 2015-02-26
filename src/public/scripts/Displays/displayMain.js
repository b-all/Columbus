var hoverInfoOn = false;
var advModeOn = false;

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
        }
      });

    $("#advModeInput").keyup(function (e) {
        if (e.keyCode === 13) {
            var target = $('#advModeInput').val();
            console.log(target);
            advMode(target,function(results) {

            });
            // search(target, function () {
            //
            // });
        }
    });

    $("#advModeInput").on('click',function() {
        editingProperties=true;
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

function toggleAdvancedMode() {
    advModeOn = !advModeOn;
    if (!advModeOn) {
        $('#advancedModeBtn').removeClass('btn-primary');
        $('#advancedModeBtn').addClass('btn-success');
        $('.advMode').hide();
        // toastInfo("Advanced Mode turned off.");
    } else {
        $('#advancedModeBtn').addClass('btn-primary');
        $('#advancedModeBtn').removeClass('btn-success');
        $('.advMode').show();
        $('#advModeInput').val('Enter Cypher query...');
        // toastInfo("Advanced Mode for Cypher queries turned on.");
    }
}

var animatingGetNeighborsIcon = false;
var getNeighborsAnimationIndex = 32;
function toggleAnimateGetNeighborsIcon () {
    animatingGetNeighborsIcon = !animatingGetNeighborsIcon;
    runGetNeighborsAnimation();
}

function runGetNeighborsAnimation() {
    if (getNeighborsAnimationIndex !== 32) {
        $('#svg_' + getNeighborsAnimationIndex - 1).attr("fill", '#00bf00');
    } else {
        $('#svg_39').attr("fill", '#00bf00');
    }
    $('#svg_' + getNeighborsAnimationIndex).attr("fill", "#ffffff");
    if (animatingGetNeighborsIcon) {
        setTimeout(runGetNeighborsAnimation, 100);
    } else {
        setTimeout(function () {
            $('#svg_' + getNeighborsAnimationIndex).attr("fill", '#00bf00');
        });
    }
}
