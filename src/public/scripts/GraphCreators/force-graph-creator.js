// define ForceGraphCreator object
var isHovering = false;
var ForceGraphCreator = function(svg, nodes, edges){
    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var thisGraph = this;
    thisGraph.nodes = nodes;
    thisGraph.edges = edges;
    var force;

    thisGraph.state = {
        selectedNode: null,
        selectedEdge: null,
        mouseDownNode: null,
        mouseDownLink: null,
        justDragged: false,
        justScaleTransGraph: false,
        lastKeyDown: -1,
        shiftNodeDrag: false,
        selectedText: null
    };

    ForceGraphCreator.prototype.consts = {
        selectedClass: "selected",
        connectClass: "connect-node",
        circleGClass: "conceptG",
        graphClass: "graph",
        activeEditId: "active-editing",
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
        nodeRadius: 50
    };

    ForceGraphCreator.prototype.dragmove = function(d) {
        var thisGraph = this;
        if (thisGraph.state.shiftNodeDrag){
            thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(thisGraph.svgG.node())[1]);
        } else{
            d.x += d3.event.dx;
            d.y +=  d3.event.dy;
            thisGraph.updateGraph();
        }
    };

    // keydown on main svg
    ForceGraphCreator.prototype.svgKeyDown = function() {
        var thisGraph = this,
            state = thisGraph.state,
            consts = thisGraph.consts;
        // make sure repeated key presses don't register for each keydown
        if(state.lastKeyDown !== -1) return;

        state.lastKeyDown = d3.event.keyCode;
        var selectedNode = state.selectedNode,
            selectedEdge = state.selectedEdge;


        switch(d3.event.keyCode) {
            case consts.BACKSPACE_KEY:
            case consts.DELETE_KEY:
                if (selectedNode && !editingProperties){
                    d3.event.preventDefault();
                    requestDeleteNode(selectedNode, thisGraph.deleteNode);
                } else if (selectedEdge && !editingProperties){
                    d3.event.preventDefault();
                    requestDeleteRelationship(selectedEdge, thisGraph.deleteRel);
                }
                if (!editingProperties){
                    d3.event.preventDefault();
                    hideSideMenu('default');
                }
                break;
        }
    };

    ForceGraphCreator.prototype.deleteNode = function () {
        var selectedNode = state.selectedNode;
        thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
        thisGraph.spliceLinksForNode(selectedNode);
        labels[selectedNode.labels[0]].count--;
        state.selectedNode = null;
        thisGraph.updateGraph();
        createLabelKey();
    };

    ForceGraphCreator.prototype.removeNodeAndNeighbors = function () {
        var selectedNode = state.selectedNode;
        thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
        thisGraph.spliceLinksAndTheirNodesForNode(selectedNode);
        labels[selectedNode.labels[0]].count--;
        state.selectedNode = null;
        thisGraph.updateGraph();
        createLabelKey();
    };

    ForceGraphCreator.prototype.spliceLinksAndTheirNodesForNode = function (node) {
        var thisGraph = this,

        toSpliceLinks = thisGraph.edges.filter(function(l) {
            return (l.source === node || l.target === node);
        });

        toSpliceLinks.map(function(l) {
            thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);

            thisGraph.edges.map(function (l2) {
                if ((l.source.id === l2.target.id || l.target.id === l2.target.id ||
                    l.source.id === l2.source.id || l.target.id === l2.source.id) &&
                    l2.source.id !== node.id && l2.target.id !== node.id) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(l2), 1);
                }
            });

            if (thisGraph.nodes.indexOf(l.source) !== -1) {
                thisGraph.nodes.splice(thisGraph.nodes.indexOf(l.source), 1);
            }
            if (thisGraph.nodes.indexOf(l.target) !== -1) {
                thisGraph.nodes.splice(thisGraph.nodes.indexOf(l.target), 1);
            }

        });


    };

    ForceGraphCreator.prototype.deleteRel = function () {
        var selectedEdge = state.selectedEdge;
        thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
        state.selectedEdge = null;
        thisGraph.updateGraph();
    };

    ForceGraphCreator.prototype.svgKeyUp = function() {
        this.state.lastKeyDown = -1;
    };

    // listen for key events
    d3.select(window).on("keydown", function(){
        thisGraph.svgKeyDown.call(thisGraph);
    });

    // listen for key events
    d3.select(window).on("keyup", function(){
        thisGraph.svgKeyUp.call(thisGraph);
    });

    //drag graph behavior
    thisGraph.drag = d3.behavior.drag()
        .origin(function(d){
            return {x: d.x, y: d.y};
        })
        .on("drag", function(args){
            thisGraph.state.justDragged = true;
            thisGraph.dragmove.call(thisGraph, args);
        })
        .on("dragend", function() {
            // todo check if edge-mode is selected
        });


    thisGraph.state = {
        selectedNode: null,
        selectedEdge: null,
        mouseDownNode: null,
        mouseDownLink: null,
        justDragged: false,
        justScaleTransGraph: false,
        lastKeyDown: -1,
        shiftNodeDrag: false,
        selectedText: null
    };
    thisGraph.svg = svg;
    thisGraph.svgG = svg.append("g")
        .classed(thisGraph.consts.graphClass, true)
        .attr("id", "graph");

    // listen for resize
    window.onresize = function(){updateWindow(svg);};


    svg.on("mousedown", function(d){svgMouseDown(thisGraph, d);});
    svg.on("mouseup", function(d){svgMouseUp(thisGraph, d);});
    svg.on("dblclick", function(d){svgMouseDblClick(thisGraph, d);});


    var svgG = thisGraph.svgG;

    function svgMouseUp (d) {
        state = thisGraph.state;
        if (state.justScaleTransGraph) {
            // dragged not clicked
            state.justScaleTransGraph = false;
        }
    }

    function svgMouseDown(d){
        /*var prevNode = this.state.selectedNode;
        if (prevNode) {
            this.removeSelectFromNode();
        }
        var prevRel = this.state.selectedEdge;
        if (prevRel) {
            this.removeSelectFromEdge();
        }*/
        hideSideMenu('relationship');
        hideSideMenu('node');
        hideSideMenu('default');
        thisGraph.unfilter();
        thisGraph.state.selectedNode = null;
        thisGraph.state.selectedEdge = null;
        d3.selectAll('.node').attr('selected',false)
            .select('circle')
            .attr('fill', function(d){return d.color;});
        d3.selectAll('.link').attr('selected',false)
            .select('path')
            .attr('stroke', function(d){return 'black';});
    }

    function svgMouseDblClick(thisGraph, d) {
        var xycoords = d3.mouse(thisGraph.svgG.node());

        // bring up create node side menu
        showCreateNodeSideMenu(xycoords);
    }

    function zoomed () {
        thisGraph.state.justScaleTransGraph = true;
        d3.select("." + thisGraph.consts.graphClass)
            .attr("transform", "translate(" + (translateDelta = d3.event.translate) + ") scale(" + (zoomRatio = d3.event.scale) + ")");
    }

    function updateWindow (svg){
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    }

    // listen for dragging
    var dragSvg = d3.behavior.zoom()
        .on("zoom", function(){
            if (d3.event.sourceEvent.shiftKey){
                // TODO  the internal d3 state is still changing
                return false;
            } else{
                zoomed(thisGraph);
            }
            return true;
        })
        .on("zoomstart", function(){
            if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
        })
        .on("zoomend", function(){
            d3.select('body').style("cursor", "auto");
        });

    svg.call(dragSvg).on("dblclick.zoom", null);



    ForceGraphCreator.prototype.updateGraph = function () {
        force = d3.layout.force()
            .size([width, height])
            .charge(-1000)
            .linkDistance(100)
            .on("tick", tick);

        var drag = force.drag()
            .on("dragstart", dragstart)
            .on("dragend", dragend);

        var container = d3.select('.graph');
        container.selectAll("*").remove();
        var link = container.selectAll(".link"),
            node = container.selectAll(".node");

        // build the arrow.
        var defs = container.append('svg:defs');
        defs.append('svg:marker')
            .attr('id', 'end')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', "32")
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        force
            .nodes(thisGraph.nodes)
            .links(thisGraph.edges)
            .start();


        link = link.data(thisGraph.edges)
            .enter().append("svg:g")
            .attr("class", "link")
            .on('mousedown', linkMouseDown)
            .append("svg:path")
            .attr("marker-end", "url(#end)")
            .attr("id", function(d) { return 'path' + d.id;})
            .style('opacity', function(d) {
                if (d.filtered) {
                    return 1;
                } else {
                    return 0.1;
                }
            });

        node = node.data(thisGraph.nodes)
            .enter().append("g")
            .on('mousedown', nodeMouseDown)
            .on('dblclick', nodeDblClick)
            .on('mouseover', nodeMouseOver)
            .on('mouseleave', nodeMouseLeave)
            .style('opacity', function(d) {
                if (d.filtered) {
                    return 1;
                } else {
                    return 0.1;
                }
            })
            .call(drag)
            .attr("class", "node");

        node
            .append("circle")
            .attr("r", 30);


        // place text on each node
        var labels = node.append("text")
                        .attr("text-anchor", "middle");

        //var relLabels = d3.select(".graph").selectAll(".link").append("text");

        // get settings for text to display on each node
        var nodeTextProps;
        if (typeof localStorage.columbusPreferences !== 'undefined') {
            var lsProps = JSON.parse(localStorage.columbusPreferences);
            nodeTextProps = lsProps.nodeTextProps;
        }

        $('.node').hover(function(){
            $(this).find('circle').css('stroke', 'gray');
        }, function () {
            $(this).find('circle').css('stroke', 'black');
        });
        function tick() {
            link.attr("d", function(d){
                return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
            });

            node.select('circle').attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            //color lines
            d3.selectAll('.link').select('path')
                .attr("stroke", function(d) {
                    return (d3.select(this.parentNode).attr('selected') === 'true') ? "rgb(255,214,168)" : 'black';
                });

            //color nodes
            d3.selectAll('.node').select('circle')
                .attr("fill", function(d) {
                    return (d3.select(this.parentNode).attr('selected') === 'true') ? "rgb(255,214,168)" : d.color;
                });

            // label nodes
            labels.selectAll("*").remove();
            node.select('text').attr("x", function(d){ return isNaN(d.x) ?  d.x : parseFloat(d.x);  })
                .attr("y", function(d){ return isNaN(d.y) ?  d.y : parseFloat(d.y) + 3; })
                .attr("fill", "black")
                .attr("font-size", "10")
                .style("cursor", 'default')
                .text(function(d){
                    var displayedProp;
                    if (typeof nodeTextProps !== 'undefined') {
                        nodeTextProps.forEach(function (val, i, array) {
                            if (val.label === d.labels[0]) {
                                displayedProp = val.property;
                            }
                        });
                    }


                    var displayedText;
                    if (typeof d.data[displayedProp] !== 'undefined') {
                        if (d.data[displayedProp].toString().length >= 7) {
                            displayedText = d.data[displayedProp].toString().substring(0,8) + '...';
                        } else if (d.data[displayedProp].toString().length < 7){
                            displayedText = d.data[displayedProp].toString();
                        }
                    }

                    return displayedText || d.id;
                });

            // removed this feature (considering performance)
            /*// label relationships
            relLabels.selectAll("*").remove();
            relLabels.attr("x", "2")
                .attr("y", "20%")
                .attr("fill", "black")
                .append("textPath")
                .attr("xlink:href", function(d){
                    return '#path' + d.id;
                }).attr("startOffset", "30%")
                .html(function(d){ return d.type});*/

        }


        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }

        function dragend(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }
    };

    function nodeMouseDown(d) {
        editingProperties = false;
        d3.event.stopPropagation();
        if (selectingStartNode) {
            loadSelectedStartNode(d.id);
        } else if (selectingEndNode) {
            loadSelectedEndNode(d.id);
        } else {
            showSideMenu('node', d);
            thisGraph.state.selectedNode = d;
            thisGraph.state.selectedEdge = null;
            var allNodes = d3.selectAll('.node')
                .attr('selected', 'false')
                .select('circle')
                .attr('fill', function(d){return d.color;});
            var allLinks = d3.selectAll('.link')
                .attr('selected', 'false')
                .select('path')
                .attr('stroke', function(d){return 'black';});
            d3.select(this).attr('selected', 'true')
                .select('circle')
                .attr("fill", "rgb(255, 214, 168)");
        }
    }

    function nodeMouseOver (d) {
        var props = [];
        var data = [];
        for (var i in d.data) {
            var obj = {};
            obj[i] = d.data[i];
            data.push(obj);
        }
        if (hoverInfoOn) {
            isHovering = true;
            $('#nodeDataHoverTable').empty();
            if (typeof localStorage.columbusPreferences !== 'undefined') {
                var lsProps = JSON.parse(localStorage.columbusPreferences).hoverPriorities;
                for (var i = 0; i < lsProps.length; i++) {
                    if (d.labels[0] === lsProps[i].label) {
                        props.push(lsProps[i].property);
                    }
                }
            }
            for (var i = 0; i < props.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].hasOwnProperty(props[i])) {
                        var dataToMove = data[j];
                        data.splice(j, 1);
                        data.unshift(dataToMove);
                    }
                }
            }
            for (var i = 0; i < data.length; i++) {
                $('#nodeDataHoverTable').append(
                    '<tr>' +
                        '<td>' +
                            Object.getOwnPropertyNames(data[i])[0] +
                        '</td>' +
                        '<td width="5px">' +
                            ':' +
                        '</td>' +
                        '<td>' +
                            data[i][Object.getOwnPropertyNames(data[i])[0]] +
                        '</td>' +
                    '</tr>'
                );
            }
            $('.nodeDataHover').show();
        }
    }

    function nodeMouseLeave (d) {
        if (hoverInfoOn) {
            isHovering = false;
            $('#nodeDataHoverTable').empty();
            $('.nodeDataHover').fadeOut('fast');
        }
    }

    function linkMouseDown(d) {
        editingProperties = false;
        thisGraph.state.selectedEdge = d;
        thisGraph.state.selectedNode = null;
        d3.event.stopPropagation();
        var allNodes = d3.selectAll('.node')
            .attr('selected', 'false')
            .select('circle')
            .attr('fill', function(d){return d.color;});
        var allLinks = d3.selectAll('.link')
            .attr('selected', 'false')
            .select('path')
            .attr('stroke', function(d){return 'black';});
        d3.select(this)
            .attr('selected', 'true')
            .select('path')
            .attr("stroke", "rgb(255, 214, 168)");
        showSideMenu('relationship', d);
    }

    function nodeDblClick (d) {
        d3.event.stopPropagation();
        showCreateRelSideMenu(d);
    }

    // remove edges associated with a node
    ForceGraphCreator.prototype.spliceLinksForNode = function(node) {
        var thisGraph = this,

        toSplice = thisGraph.edges.filter(function(l) {
            return (l.source === node || l.target === node);
        });
        toSplice.map(function(l) {
            thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
        });
    };

    ForceGraphCreator.prototype.addNode = function (node) {
        thisGraph.nodes.push(node);
    };

    ForceGraphCreator.prototype.addRel = function (rel) {
        thisGraph.edges.push(rel);
    };

    ForceGraphCreator.prototype.hasNode = function(id) {
        for (var i = 0; i < thisGraph.nodes.length; i++) {
            if (nodes[i].id === id) {
                return true;
            }
        }
        return false;
    };

    ForceGraphCreator.prototype.getNodeIndexById = function(id) {
        for (var i = 0; i < thisGraph.nodes.length; i++) {
            if (nodes[i].id === id) {
                return i;
            }
        }
        return false;
    };

    ForceGraphCreator.prototype.filter = function (term) {
        var count = 0;
        var filteredIds = [];

        for (var i = 0; i < thisGraph.nodes.length; i++) {
            thisGraph.nodes[i].filtered = true;
            for (var j in thisGraph.nodes[i].data) {
                if (thisGraph.nodes[i].data[j].toString().toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    thisGraph.nodes[i].filtered = true;
                    filteredIds.push(thisGraph.nodes[i].id);
                    count++;
                    break;
                } else {
                    thisGraph.nodes[i].filtered = false;
                }
            }
        }


        for (var k = 0; k < thisGraph.edges.length; k++) {
            thisGraph.edges[k].filtered = true;
            var foundSource = false;
            var foundTarget = false;
            for (var l = 0; l < filteredIds.length; l++) {
                if (thisGraph.edges[k].target.id === filteredIds[l]) {
                    foundTarget = true;
                }
                if (thisGraph.edges[k].source.id === filteredIds[l]) {
                    foundSource = true;
                }
                if (foundSource && foundTarget) {
                    break;
                }
            }

            if (foundSource && foundTarget) {
                thisGraph.edges[k].filtered = true;
            } else {
                thisGraph.edges[k].filtered = false;
            }

        }

        thisGraph.updateGraph();
        return count;
    };

    ForceGraphCreator.prototype.unfilter = function () {
        var falseFound = false;
        for (var i = 0; i < thisGraph.nodes.length; i++) {
            if (!thisGraph.nodes[i].filtered) {
                falseFound = true;
            }
            thisGraph.nodes[i].filtered = true;
        }
        for (var k = 0; k < thisGraph.edges.length; k++) {
            if (!thisGraph.edges[k].filtered) {
                falseFound = true;
            }
            thisGraph.edges[k].filtered = true;
        }
        if (falseFound) {
            thisGraph.updateGraph();
        }
    };

    ForceGraphCreator.prototype.getSelectedNodeId = function () {
        var thisGraph = this;
        return thisGraph.state.selectedNode;
    };

    ForceGraphCreator.prototype.addNodeNeighbors = function (data, xLoc, yLoc, width, height) {
        var nodes = data.nodes;
        var edges = data.relationships;

        force.stop();
        var noNewNodes = true;
        for (var i = 0; i < nodes.length; i++) {
            var foundNode = false;
            for (var j = 0; j < thisGraph.nodes.length; j++) {
                if (nodes[i].id === thisGraph.nodes[j].id) {
                    foundNode = true;
                }
            }
            if (!foundNode) {
                thisGraph.nodes.push(nodes[i]);
                noNewNodes = false;
            }
            // colorize new nodes based on label
            if (typeof nodes[i].labels[0] !== 'undefined') {
                nodes[i].color = labels[nodes[i].labels[0]].color;
            } else {
                // use _unlabeled color
                labels[0].color;
            }

        }

        if (noNewNodes) {
            toastInfo('There are no hidden neighbors of this node');
            return;
        }

        for (var y = 0; y < edges.length; y++) {
            for (var x = 0; x < thisGraph.nodes.length; x++) {
                if (thisGraph.nodes[x].id === edges[y].target) {
                    edges[y].target = thisGraph.nodes[x];

                }
                if (thisGraph.nodes[x].id === edges[y].source) {
                    edges[y].source = thisGraph.nodes[x];
                }
            }
        }

        for (var k = 0; k < edges.length; k++) {
            var foundEdge = false;
            for (var l = 0; l < thisGraph.edges.length; l++) {
                if (edges[k].id === thisGraph.edges[l].id) {
                    foundEdge = true;
                }
            }
            if (!foundEdge) {
                thisGraph.edges.push(edges[k]);
            }
        }


        thisGraph.updateGraph();
    };

};

var zoomRatio = 1;
var translateDelta = [0,0];
