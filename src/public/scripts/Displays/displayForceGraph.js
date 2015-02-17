var graph, labels, c = colors;
var displayForceData = function (initialGraph, xLoc, yLoc, width, height) {
    /**
     * Basic data model
     *
     **
    var nodes = [{title: "new concept", id: 0, x: xLoc, y: yLoc},
                 {title: "new concept", id: 1, x: xLoc, y: yLoc + 200}];
    var edges = [{source: nodesIndex, target: nodesIndex}];
    */

    // initial node data
    nodes = initialGraph.nodes;
    edges = initialGraph.relationships;

    var x1 = xLoc, y1 = yLoc;
    var mult = 20;

    labels = { '_unlabeled' : { count: 0, x_center : 0, y_center: 0 }};

    //get a count for number of nodes with a specific label
    for (var i = 0; i < nodes.length; i++) {
        // nodes with no label are counted as _unlabeled
        if (nodes[i].labels.length === 0) {
            labels._unlabeled.count++;
        } else {
            if (labels.hasOwnProperty(nodes[i].labels[0])) {
                labels[nodes[i].labels[0]].count++;
            } else {
                labels[nodes[i].labels[0]] = {};
                labels[nodes[i].labels[0]].count = 1;
            }
        }

    }

    //space out node spheres by amount of nodes with similar labels
    var firstTimeThrough = true;
    var prevXLoc, prevYLoc, prevRadius;
    for (var index in labels) {
        if (labels[index].count === 0) {
             continue;
        }
        var numCircles = 0;
        var numNodes = labels[index].count;
        var d = 4;
        numNodes--;
        if (numNodes > 0) {
            numCircles++;
        }
        while (numNodes > 0) {
            if (numNodes > d * 2) {
                numNodes -= d * 2;
                numCircles++;
            } else {
                break;
            }
            d += 2;
        }
        labels[index].total_radius = (numCircles === 0) ? 80 : numCircles * 180;

        //set initial x and y coordinates per label group
        if (firstTimeThrough) {
            labels[index].x_center = xLoc;
            labels[index].y_center = yLoc;
            prevXLoc = xLoc;
            prevYLoc = yLoc;
            prevRadius = labels[index].total_radius;
            firstTimeThrough = false;
        } else {
            labels[index].x_center = prevXLoc + 2 * labels[index].total_radius + prevRadius;
            labels[index].y_center = yLoc;
            prevXLoc = labels[index].x_center;
            prevYLoc = labels[index].y_center;
            prevRadius = labels[index].total_radius;
        }
        labels[index].currentTheta = 0;
        labels[index].currentR = 180;
        labels[index].currentDivisor = 4;
        labels[index].currentRadian = Math.PI / 4;
        labels[index].currentJ = 0;
        var colorIndex = Math.floor(Math.random() * c.length);
        var randColor = c[colorIndex];
        c.splice(colorIndex, 1);
        labels[index].color = randColor;
    }

    var theta = 0;
    var divisor = 4;
    var radian = Math.PI / divisor;
    var r = 180;
    var j = 0;
    for (var i = 0; i < nodes.length; i++) {
        var lab;
        if (nodes[i].labels.length === 0) {
            lab = "_unlabeled";
        } else {
            lab = nodes[i].labels[0];
        }
        nodes[i]["color"] = labels[lab].color;
        x1 = labels[lab].x_center;
        y1 = labels[lab].y_center;
        r = labels[lab].currentR;
        divisor = labels[lab].currentDivisor;
        theta = labels[lab].currentTheta;
        radian = labels[lab].currentRadian;
        j = labels[lab].currentJ;
        if (j === 0) {
          nodes[i].x = x1;
          nodes[i].y = y1;
          labels[lab].currentJ++;
        } else {
          nodes[i].x = r * Math.cos(theta) + x1;
          nodes[i].y = r * Math.sin(theta) + y1;
          labels[lab].currentTheta += radian;
          theta += radian;
          if (theta >= 2 * Math.PI) {
            labels[lab].currentR += 180;
            labels[lab].currentDivisor += 2;
            labels[lab].currentRadian = Math.PI / labels[lab].currentDivisor;
            labels[lab].currentTheta = labels[lab].currentRadian;

          }
        }
    }

    for (var i = 0; i < edges.length; i++) {
        var sourceFound = false;
        var targetFound = false;
        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].id === edges[i].source && !sourceFound) {
                edges[i].source = j;
                sourceFound = true;
            }
            if (nodes[j].id === edges[i].target && !targetFound) {
                edges[i].target = j;
                targetFound = true;
            }
        }
        if (!sourceFound || !targetFound) {
            edges.splice(i, 1);
            i--;
        }
    }

    /** MAIN SVG **/
    if (typeof d3.select("#graphContainer").select("svg") !== 'undefined' ) {
      d3.select("#graphContainer").select("svg").remove();
    }
    var svg = d3.select("#graphContainer").append("svg")
          .attr("width", width)
          .attr("height", height);

    // change which type of graph to create
    graph = new ForceGraphCreator(svg, nodes, edges);
    graph.updateGraph();

    createLabelKey();
};

function createLabelKey() {
    var labelKeyString = "";
    for (var i in labels) {
        if (labels[i].count === 0) continue;
        labelKeyString += "<tr>" +
                                "<td>" +
                                    "<svg height=\"22px\" width=\"22px\">" +
                                        "<circle cx=\"11\" cy=\"11\" r=\"10px\" stroke=\"black\" fill=\"" + labels[i].color + "\" />" +
                                    "</svg>" +
                                "</td>" +
                                "<td>" +
                                    i +
                                "</td>" +
                            "</tr>";
    }
    $('#labelKey').empty();
    $('#labelKey').append(labelKeyString);
    $('#labelKey').show();
}
