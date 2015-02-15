// define ForceGraphCreator object
var ForceGraphCreator = function(svg, nodes, edges){
    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var thisGraph = this;
    thisGraph.nodes = nodes;
    thisGraph.edges = edges;

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
        .classed(thisGraph.consts.graphClass, true);

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
        var force = d3.layout.force()
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
            .attr("id", function(d) { return 'path' + d.id;});

        node = node.data(thisGraph.nodes)
            .enter().append("g")
            .on('mousedown', nodeMouseDown)
            .on('dblclick', nodeDblClick)
            .call(drag)
            .attr("class", "node")
            .append("circle")
            .attr("r", 30);


        // place text on each node
        var labels = d3.select(".graph").selectAll(".node").append("text");
        //var relLabels = d3.select(".graph").selectAll(".link").append("text");

        function tick() {
            link.attr("d", function(d){
                return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
            });

            node.attr("cx", function(d) { return d.x; })
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
            labels.attr("x", function(d){ return isNaN(d.x) ?  d.x : parseFloat(d.x) - 10;  })
                .attr("y", function(d){ return isNaN(d.y) ?  d.y : parseFloat(d.y) + 3; })
                .attr("fill", "black")
                .attr("font-size", "10")
                .style("cursor", 'default')
                .text(function(d){return d.id;});

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

    function linkMouseDown(d) {
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

};

var zoomRatio = 1;
var translateDelta = [0,0];
